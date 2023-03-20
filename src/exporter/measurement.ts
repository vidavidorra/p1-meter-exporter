import {type WriteApi, Point} from '@influxdata/influxdb-client';
import {Duration} from 'luxon';
import logger from '../logger.js';
import type P1Meter from '../p1-meter/api.js';
import Exporter from './exporter.js';

function round(value: number, decimalPlaces: number): number {
  const factor = 10 ** Math.max(0, decimalPlaces);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export default class Measurement extends Exporter {
  private readonly _p1Meter: P1Meter;
  private readonly _writeApi: WriteApi;

  constructor(p1Meter: P1Meter, writeApi: WriteApi) {
    super('measurement', Duration.fromObject({seconds: 1}));
    this._p1Meter = p1Meter;
    this._writeApi = writeApi;
  }

  async export(): Promise<void> {
    const telegram = await this._p1Meter.telegram();

    logger.debug(
      {date: telegram.date, cp: telegram.consumedPower},
      'Export measurement',
    );

    this._writeApi.writePoint(
      new Point('measurement')
        .timestamp(telegram.date)
        .intField(
          'totalConsumedPowerTariff1',
          telegram.totalConsumedPowerTariff1,
        )
        .intField(
          'totalConsumedPowerTariff2',
          telegram.totalConsumedPowerTariff2,
        )
        .intField('tariff', telegram.tariff)
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
