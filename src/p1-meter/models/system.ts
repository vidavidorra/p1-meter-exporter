import {z} from 'zod';
import camelcaseKeys from 'camelcase-keys';

/**
 * System endpoint as described by [HomeWizard Energy API](
 * https://homewizard-energy-api.readthedocs.io/endpoints.html#system-api-v1-system).
 */
const schema = z.preprocess(
  (arg) => (typeof arg === 'object' && arg !== null ? camelcaseKeys(arg) : arg),
  z.object({
    cloudEnabled: z.boolean(),
  }),
);

type System = z.infer<typeof schema>;

export {type System, schema};
