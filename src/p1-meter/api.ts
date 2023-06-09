import axios, {AxiosError, type AxiosInstance} from 'axios';
import {type z} from 'zod';
import {type Config} from '../config.js';
import {DetailedError} from '../error.js';
import * as models from './models/index.js';
import {type Telegram} from './telegram/model.js';
import parse from './telegram/parse.js';

class P1Meter {
  private readonly _axios: AxiosInstance;

  constructor(url: Config['meterApiUrl']) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this._axios = axios.create({baseURL: url, timeout: 10_000});
    this._axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof Error) {
          if (
            error instanceof AxiosError &&
            error.code !== undefined &&
            [
              'EHOSTUNREACH',
              'ECONNRESET',
              'ETIMEDOUT',
              'EHOSTDOWN',
              'ECONNABORTED',
            ].includes(error.code)
          ) {
            throw new DetailedError(error.message, {}, false, error);
          }

          throw error;
        }
      },
    );
  }

  async basicInformation(): Promise<models.BasicInformation> {
    return this.request('/', models.basicInformation);
  }

  async system(): Promise<models.System> {
    return this.request('/v1/system', models.system);
  }

  async telegram(): Promise<Telegram> {
    const data = await this.request('/v1/telegram', models.telegram);
    return parse(data);
  }

  private async request<T>(
    path: string,
    schema: z.ZodEffects<z.ZodTypeAny, T, unknown> | z.ZodType<T>,
  ): Promise<T> {
    const {data} = await this._axios.get<unknown>(path);

    const result = schema.safeParse(data);
    if (!result.success) {
      throw new DetailedError(`Request "${path}" failed with invalid data`, {
        data,
        issues: result.error.issues,
      });
    }

    return result.data;
  }
}

export default P1Meter;
