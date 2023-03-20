import {env} from 'node:process';
import {z} from 'zod';
import dotenv from 'dotenv';

const schema = z.object({
  meterApiUrl: z.string().url(),
  influxDb: z.object({
    url: z.string().url(),
    token: z.string().min(1),
    organisation: z.string().min(1),
    bucket: z.string().min(1),
  }),
  logLevel: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('error'),
});

type Config = z.infer<typeof schema>;

dotenv.config();

const config = schema.parse({
  meterApiUrl: env.P1E_METER_API_URL ?? env.METER_API_URL,
  influxDb: {
    url: env.P1E_INFLUXDB_URL ?? env.INFLUXDB_URL,
    token: env.P1E_INFLUXDB_TOKEN ?? env.INFLUXDB_TOKEN,
    organisation: env.P1E_INFLUXDB_ORGANISATION ?? env.INFLUXDB_ORGANISATION,
    bucket: env.P1E_INFLUXDB_BUCKET ?? env.INFLUXDB_BUCKET,
  },
  logLevel: env.P1E_LOG_LEVEL ?? env.LOG_LEVEL,
});

export {config, type Config};
