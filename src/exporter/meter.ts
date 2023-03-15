import {type WriteApi, Point} from '@influxdata/influxdb-client';
import {Duration} from 'luxon';
import type P1Meter from '../p1-meter/api.js';
import Exporter from './exporter.js';

export default class Meter extends Exporter {
  private readonly _p1Meter: P1Meter;
  private readonly _writeApi: WriteApi;

  constructor(p1Meter: P1Meter, writeApi: WriteApi) {
    super('meter', Duration.fromObject({hour: 24}));
    this._p1Meter = p1Meter;
    this._writeApi = writeApi;
  }

  async export(): Promise<void> {
    const telegram = await this._p1Meter.telegram();

    this._writeApi.writePoint(
      new Point('meter')
        .timestamp(telegram.date)
        .stringField('dsmrVersion', telegram.dsmrVersion)
        .stringField('equipmentIdentifier', telegram.equipmentIdentifier),
    );
  }
}
