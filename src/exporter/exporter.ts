import {DateTime, Duration, type DurationLikeObject} from 'luxon';
import rollbar from '../rollbar.js';
import logger from '../logger.js';
import {DetailedError} from '../error.js';

export default abstract class Exporter {
  protected readonly _logDetails: Record<string, unknown>;
  private readonly _interval: Duration;
  private _promise: Promise<void>;
  private _timeout: NodeJS.Timeout;

  constructor(readonly name: string, interval: DurationLikeObject) {
    const minimumInterval = Duration.fromObject({milliseconds: 1000});
    this._interval =
      Duration.fromObject(interval) < minimumInterval
        ? minimumInterval
        : Duration.fromObject(interval);
    this._logDetails = {exporter: name, interval: this._interval.toHuman()};
    this._promise = Promise.resolve();
    this._timeout = setTimeout(() => 0, 0);

    if (interval < minimumInterval) {
      logger.warn(
        {...this._logDetails, minimumInterval: minimumInterval.toHuman()},
        'Interval is smaller than minimum, limited interval to minimum',
      );
    }
  }

  start(): void {
    logger.info(this._logDetails, 'Start exporter');
    this.setExportTimeout(true);
  }

  async stop(): Promise<void> {
    logger.info({exporter: this.name}, 'Stop exporter');

    const start = DateTime.now();
    clearTimeout(this._timeout);
    await Promise.allSettled([this._promise]);
    logger.info(
      {exporter: this.name},
      'Exporter stopped in %s',
      DateTime.now().diff(start).toHuman(),
    );
  }

  abstract export(date: Date): Promise<void>;

  private setExportTimeout(exportImmediately?: boolean): void {
    clearTimeout(this._timeout);

    const now = DateTime.now();
    const nextExport = now
      .minus(now.toMillis() % this._interval.as('milliseconds'))
      .plus(this._interval)
      .plus({milliseconds: 500});

    let timeout = nextExport.diff(now);
    if (exportImmediately && timeout.as('milliseconds') > 1000) {
      timeout = Duration.fromObject({milliseconds: 0});
      logger.info(this._logDetails, 'Export a single time immediately');
    } else {
      logger.info(
        this._logDetails,
        'Next export in %s',
        nextExport.toRelative({base: now, round: true, padding: 500}),
      );
    }

    this._timeout = setTimeout(() => {
      this._promise = this.export(nextExport.toJSDate())
        .catch((error) => {
          if (
            (error instanceof DetailedError && error.reportToRollbar) ||
            (!(error instanceof DetailedError) && error instanceof Error)
          ) {
            rollbar.error(error);
          }

          logger.error(
            error,
            error instanceof Error ? error.message : undefined,
          );
        })
        .finally(() => {
          this.setExportTimeout();
        });
    }, timeout.as('milliseconds'));
  }
}
