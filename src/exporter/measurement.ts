import {type WriteApi, Point} from '@influxdata/influxdb-client';
import type P1Meter from '../p1-meter/api.js';
import round from '../round.js';
import Exporter from './exporter.js';

export default class Measurement extends Exporter {
  private readonly _p1Meter: P1Meter;
  private readonly _writeApi: WriteApi;

  constructor(p1Meter: P1Meter, writeApi: WriteApi) {
    super('measurement', {seconds: 1});
    this._p1Meter = p1Meter;
    this._writeApi = writeApi;
  }

  async export(): Promise<void> {
    const telegram = await this._p1Meter.telegram();

    this._writeApi.writePoint(
      new Point('measurement')
        .timestamp(telegram.date)
        .intField(
          'totalConsumedPowerLowTariff',
          telegram.totalConsumedPowerLowTariff,
        )
        .intField(
          'totalConsumedPowerHighTariff',
          telegram.totalConsumedPowerHighTariff,
        )
        .stringField('tariff', telegram.tariff)
        .intField('consumedPower', telegram.consumedPower)
        .floatField('l1Voltage', telegram.l1Voltage)
        .floatField('l2Voltage', telegram.l2Voltage)
        .floatField('l3Voltage', telegram.l3Voltage)
        .floatField(
          'l1Current',
          round(telegram.l1ConsumedActivePower / telegram.l1Voltage, 3),
        )
        .floatField(
          'l2Current',
          round(telegram.l2ConsumedActivePower / telegram.l2Voltage, 3),
        )
        .floatField(
          'l3Current',
          round(telegram.l3ConsumedActivePower / telegram.l3Voltage, 3),
        )
        .intField('l1ConsumedActivePower', telegram.l1ConsumedActivePower)
        .intField('l2ConsumedActivePower', telegram.l2ConsumedActivePower)
        .intField('l3ConsumedActivePower', telegram.l3ConsumedActivePower),
    );
  }
}
