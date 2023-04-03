import {type WriteApi, Point} from '@influxdata/influxdb-client';
import type P1Meter from '../p1-meter/api.js';
import Exporter from './exporter.js';

export default class PowerStatus extends Exporter {
  private readonly _p1Meter: P1Meter;
  private readonly _writeApi: WriteApi;

  constructor(p1Meter: P1Meter, writeApi: WriteApi) {
    super('power-status', {minute: 15});
    this._p1Meter = p1Meter;
    this._writeApi = writeApi;
  }

  async export(): Promise<void> {
    const telegram = await this._p1Meter.telegram();

    this._writeApi.writePoint(
      new Point('power-status')
        .timestamp(telegram.date)
        .intField('powerFailures', telegram.powerFailures)
        .intField('longPowerFailures', telegram.longPowerFailures)
        .intField('l1VoltageSags', telegram.l1VoltageSags)
        .intField('l2VoltageSags', telegram.l2VoltageSags)
        .intField('l3VoltageSags', telegram.l3VoltageSags)
        .intField('l1VoltageSwells', telegram.l1VoltageSwells)
        .intField('l2VoltageSwells', telegram.l2VoltageSwells)
        .intField('l3VoltageSwells', telegram.l3VoltageSwells),
    );
  }
}
