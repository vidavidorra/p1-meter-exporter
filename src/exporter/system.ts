import {type WriteApi, Point} from '@influxdata/influxdb-client';
import {Duration, type DateTime} from 'luxon';
import type P1Meter from '../p1-meter/api.js';
import Exporter from './exporter.js';

export default class System extends Exporter {
  private readonly _p1Meter: P1Meter;
  private readonly _writeApi: WriteApi;

  constructor(p1Meter: P1Meter, writeApi: WriteApi) {
    super('system', Duration.fromObject({hour: 1}));
    this._p1Meter = p1Meter;
    this._writeApi = writeApi;
  }

  async export(date: DateTime): Promise<void> {
    const basicInformation = await this._p1Meter.basicInformation();
    const system = await this._p1Meter.system();

    this._writeApi.writePoint(
      new Point('system')
        .timestamp(date.toJSDate())
        .stringField('firmwareVersion', basicInformation.firmwareVersion)
        .stringField('apiVersion', basicInformation.apiVersion)
        .booleanField('cloudEnabled', system.cloudEnabled),
    );
  }
}
