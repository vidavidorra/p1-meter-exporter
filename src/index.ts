import process from 'node:process';
import {InfluxDB, setLogger} from '@influxdata/influxdb-client';
import {config} from './config.js';
import P1Meter from './p1-meter/api.js';
import {Measurement, Meter, PowerStatus, System} from './exporter/index.js';
import rollbar from './rollbar.js';
import logger from './logger.js';

const p1Meter = new P1Meter(config.meterApiUrl);

const influxDb = new InfluxDB({
  url: config.influxDb.url,
  token: config.influxDb.token,
});
const writeApi = influxDb.getWriteApi(
  config.influxDb.organisation,
  config.influxDb.bucket,
  's',
);

setLogger({
  error(message, error) {
    if (error instanceof Error) {
      rollbar.error(error, message);
    }

    logger.error(error, message);
  },
  warn(message, error) {
    if (error instanceof Error) {
      rollbar.warn(error, message);
    }

    logger.warn(error, message);
  },
});

const exporters = [Measurement, Meter, PowerStatus, System].map(
  (Exporter) => new Exporter(p1Meter, writeApi),
);
for (const exporter of exporters) {
  exporter.start();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await Promise.allSettled(
      exporters.map(async (exporter) => exporter.stop()),
    );
    await writeApi.close();
  });
}
