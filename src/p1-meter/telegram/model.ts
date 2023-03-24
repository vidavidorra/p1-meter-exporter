import {z} from 'zod';

const schema = z.object({
  dsmrVersion: z.string(),
  date: z.date(),
  equipmentIdentifier: z.string().max(48),
  totalConsumedPowerLowTariff: z.number().int().nonnegative(),
  totalConsumedPowerHighTariff: z.number().int().nonnegative(),
  totalGeneratedPowerLowTariff: z.number().int().nonnegative(),
  totalGeneratedPowerHighTariff: z.number().int().nonnegative(),
  tariff: z.enum(['low', 'high']),
  consumedPower: z.number().int().nonnegative(),
  generatedPower: z.number().int().nonnegative(),
  powerFailures: z.number().int().nonnegative(),
  longPowerFailures: z.number().int().nonnegative(),
  l1VoltageSags: z.number().int().nonnegative(),
  l2VoltageSags: z.number().int().nonnegative(),
  l3VoltageSags: z.number().int().nonnegative(),
  l1VoltageSwells: z.number().int().nonnegative(),
  l2VoltageSwells: z.number().int().nonnegative(),
  l3VoltageSwells: z.number().int().nonnegative(),
  message: z.string().min(1).nullable(),
  l1Voltage: z.number().nonnegative(),
  l2Voltage: z.number().nonnegative(),
  l3Voltage: z.number().nonnegative(),
  l1Current: z.number().int().nonnegative(),
  l2Current: z.number().int().nonnegative(),
  l3Current: z.number().int().nonnegative(),
  l1ConsumedActivePower: z.number().int().nonnegative(),
  l2ConsumedActivePower: z.number().int().nonnegative(),
  l3ConsumedActivePower: z.number().int().nonnegative(),
  l1GeneratedActivePower: z.number().int().nonnegative(),
  l2GeneratedActivePower: z.number().int().nonnegative(),
  l3GeneratedActivePower: z.number().int().nonnegative(),
});

type Telegram = z.infer<typeof schema>;

export {type Telegram, schema};
