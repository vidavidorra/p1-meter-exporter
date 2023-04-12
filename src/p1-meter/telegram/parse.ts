import {Buffer} from 'node:buffer';
import {z} from 'zod';
import {DateTime} from 'luxon';
import logger from '../../logger.js';
import rollbar from '../../rollbar.js';
import {DetailedError} from '../../error.js';
import round from '../../round.js';
import {type Telegram, schema} from './model.js';

function numberSchema(
  digits: number,
  decimals: number,
  unit?: string,
  multiplier = 1,
): z.ZodEffects<z.ZodString, number, string> {
  return z
    .string()
    .regex(
      new RegExp(
        [
          `^\\d{${digits - decimals}}`,
          decimals === 0 ? '' : `.\\d{${decimals}}`,
          unit === undefined ? '$' : `\\*${unit}$`,
        ].join(''),
      ),
    )
    .transform((arg) => {
      const unitLength = unit === undefined ? undefined : -`*${unit}`.length;
      const value = Number.parseFloat(arg.slice(0, unitLength)) * multiplier;
      return round(value, decimals - Math.log10(multiplier));
    });
}

const hexString = z
  .string()
  .regex(
    /^([\da-z]{2})*$/,
    'String must contain an even number of hexadecimal characters',
  );

const tariffs: ReadonlyMap<number, string> = new Map([
  [1, 'low'],
  [2, 'high'],
]);

/**
 * https://www.netbeheernederland.nl/_upload/Files/Slimme_meter_15_a727fce1f1.pdf
 * §6.12
 */
const obisReferences: ReadonlyMap<
  string,
  {key: keyof Telegram; schema: z.Schema}
> = new Map<string, {key: keyof Telegram; schema: z.Schema}>([
  [
    '1-3:0.2.8',
    {
      key: 'dsmrVersion',
      schema: hexString
        .length(2)
        .transform((arg) => `${arg.charAt(0)}.${arg.charAt(1)}`),
    },
  ],
  [
    '0-0:1.0.0',
    {
      key: 'date',
      schema: z
        .string()
        .regex(/^\d{12}[SW]$/)
        .transform((arg) =>
          DateTime.fromFormat(arg.slice(0, -1), 'yyMMddHHmmss', {
            zone: 'Europe/Amsterdam',
          }).toJSDate(),
        ),
    },
  ],
  [
    '0-0:96.1.1',
    {
      key: 'equipmentIdentifier',
      schema: hexString
        .max(96)
        .transform((arg) => Buffer.from(arg, 'hex').toString()),
    },
  ],
  [
    '1-0:1.8.1',
    {
      key: 'totalConsumedPowerLowTariff',
      schema: numberSchema(9, 3, 'kWh', 1000),
    },
  ],
  [
    '1-0:1.8.2',
    {
      key: 'totalConsumedPowerHighTariff',
      schema: numberSchema(9, 3, 'kWh', 1000),
    },
  ],
  [
    '1-0:2.8.1',
    {
      key: 'totalGeneratedPowerLowTariff',
      schema: numberSchema(9, 3, 'kWh', 1000),
    },
  ],
  [
    '1-0:2.8.2',
    {
      key: 'totalGeneratedPowerHighTariff',
      schema: numberSchema(9, 3, 'kWh', 1000),
    },
  ],
  [
    '0-0:96.14.0',
    {
      key: 'tariff',
      schema: numberSchema(4, 0).transform((arg) => tariffs.get(arg) ?? arg),
    },
  ],
  ['1-0:1.7.0', {key: 'consumedPower', schema: numberSchema(5, 3, 'kW', 1000)}],
  [
    '1-0:2.7.0',
    {key: 'generatedPower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
  ['0-0:96.7.21', {key: 'powerFailures', schema: numberSchema(5, 0)}],
  ['0-0:96.7.9', {key: 'longPowerFailures', schema: numberSchema(5, 0)}],
  // 1-0:99.97.0  Power Failure Event Log (long power failures)
  ['1-0:32.32.0', {key: 'l1VoltageSags', schema: numberSchema(5, 0)}],
  ['1-0:52.32.0', {key: 'l2VoltageSags', schema: numberSchema(5, 0)}],
  ['1-0:72.32.0', {key: 'l3VoltageSags', schema: numberSchema(5, 0)}],
  ['1-0:32.36.0', {key: 'l1VoltageSwells', schema: numberSchema(5, 0)}],
  ['1-0:52.36.0', {key: 'l2VoltageSwells', schema: numberSchema(5, 0)}],
  ['1-0:72.36.0', {key: 'l3VoltageSwells', schema: numberSchema(5, 0)}],
  [
    '0-0:96.13.0',
    {
      key: 'message',
      schema: z.preprocess(
        (arg) => (typeof arg === 'string' && arg.length === 0 ? null : arg),
        hexString
          .max(1024)
          .transform((arg) => Buffer.from(arg, 'hex').toString())
          .nullable(),
      ),
    },
  ],
  ['1-0:32.7.0', {key: 'l1Voltage', schema: numberSchema(4, 1, 'V')}],
  ['1-0:52.7.0', {key: 'l2Voltage', schema: numberSchema(4, 1, 'V')}],
  ['1-0:72.7.0', {key: 'l3Voltage', schema: numberSchema(4, 1, 'V')}],
  ['1-0:31.7.0', {key: 'l1Current', schema: numberSchema(3, 0, 'A')}],
  ['1-0:51.7.0', {key: 'l2Current', schema: numberSchema(3, 0, 'A')}],
  ['1-0:71.7.0', {key: 'l3Current', schema: numberSchema(3, 0, 'A')}],
  [
    '1-0:21.7.0',
    {key: 'l1ConsumedActivePower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
  [
    '1-0:41.7.0',
    {key: 'l2ConsumedActivePower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
  [
    '1-0:61.7.0',
    {key: 'l3ConsumedActivePower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
  [
    '1-0:22.7.0',
    {key: 'l1GeneratedActivePower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
  [
    '1-0:42.7.0',
    {key: 'l2GeneratedActivePower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
  [
    '1-0:62.7.0',
    {key: 'l3GeneratedActivePower', schema: numberSchema(5, 3, 'kW', 1000)},
  ],
]);

function extractValue(value: string): string {
  return /^\([^()]*\)$/.test(value) ? value.slice(1, -1) : value;
}

function parse(value: string): Telegram {
  const telegram: Record<string, unknown> = {};
  logger.trace({value}, 'Parse telegram');
  for (const line of value.split('\r\n')) {
    const obisReferenceEndIndex = line.indexOf('(');
    if (obisReferenceEndIndex > 0) {
      const obisReference = line.slice(0, obisReferenceEndIndex);
      const config = obisReferences.get(obisReference);
      if (config !== undefined) {
        const value = extractValue(line.slice(obisReferenceEndIndex));
        const data = config.schema.safeParse(value);
        if (data.success) {
          telegram[config.key] = data.data;
        } else {
          rollbar.error(
            {obisReference, data: line, issues: data.error.issues},
            'Telegram line failed with invalid data',
          );
          logger.error(
            {obisReference, data: line, issues: data.error.issues},
            'Telegram line failed with invalid data',
          );
        }
      }
    }
  }

  const result = schema.safeParse(telegram);
  if (!result.success) {
    throw new DetailedError('Telegram failed with invalid data', {
      data: telegram,
      issues: result.error.issues,
      telegram: value,
    });
  }

  return result.data;
}

export default parse;
