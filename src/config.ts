import {env} from 'node:process';
import {Buffer} from 'node:buffer';
import {z} from 'zod';
import dotenv from 'dotenv';
import {levels} from '@vidavidorra/bunyan-pretty-stream';

const schema = z.object({
  meterApiUrl: z.string().url(),
  influxDb: z.object({
    url: z.string().url(),
    token: z.string().min(1),
    organisation: z.string().min(1),
    bucket: z.string().min(1),
  }),
  rollbarToken: z.preprocess(
    (arg) =>
      typeof arg === 'string'
        ? Buffer.from(arg, 'base64').toString('utf8')
        : arg,
    z.string().min(1),
  ),
  logLevel: z.enum(levels).default('error'),
});

type Config = z.infer<typeof schema>;

dotenv.config({override: true});

const config = schema.parse({
  meterApiUrl: env.METER_API_URL,
  influxDb: {
    url: env.INFLUXDB_URL,
    token: env.INFLUXDB_TOKEN,
    organisation: env.INFLUXDB_ORGANISATION,
    bucket: env.INFLUXDB_BUCKET,
  },
  rollbarToken:
    env.ROLLBAR_TOKEN ?? 'Njc2NGY5MTFiYTY5NGI3Y2EzYmZiNTAyNWZhNjhhOGM=',
  logLevel: env.LOG_LEVEL,
});

export {config, type Config};
