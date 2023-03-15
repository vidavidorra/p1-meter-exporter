import {z} from 'zod';
import camelcaseKeys from 'camelcase-keys';

/**
 * Basic information endpoint as described by [HomeWizard Energy API](
 * https://homewizard-energy-api.readthedocs.io/endpoints.html#basic-information-api).
 */
const schema = z.preprocess(
  (arg) => (typeof arg === 'object' && arg !== null ? camelcaseKeys(arg) : arg),
  z.object({
    productType: z.string().min(1),
    productName: z.string().min(1),
    serial: z
      .string()
      .regex(/[\da-f]/)
      .length(12),
    firmwareVersion: z.string().regex(/^\d+\.\d+$/),
    apiVersion: z.literal('v1'),
  }),
);

type BasicInformation = z.infer<typeof schema>;

export {type BasicInformation, schema};
