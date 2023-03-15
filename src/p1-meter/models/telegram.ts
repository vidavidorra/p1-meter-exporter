import {z} from 'zod';

/**
 * Telegram endpoint as described by [HomeWizard Energy API](
 * https://homewizard-energy-api.readthedocs.io/endpoints.html#p1-telegram-api-v1-telegram).
 */
const schema = z.string().min(1);

type Telegram = z.infer<typeof schema>;

export {type Telegram, schema};
