import axios, {type AxiosInstance} from 'axios';
import {z} from 'zod';
import {type Config} from '../config.js';
import logger from '../logger.js';
import P1MeterError from '../error.js';
import * as models from './models/index.js';
import {type Telegram} from './telegram/model.js';
import parse from './telegram/parse.js';

class P1Meter {
  private readonly _axios: AxiosInstance;

  constructor(url: Config['meterApiUrl']) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this._axios = axios.create({baseURL: url});
  }

  async basicInformation(): Promise<models.BasicInformation> {
    const response = await this._axios.get('/');
    if (response.status !== 200) {
      throw new P1MeterError(
        `Basic information request failed with status ${response.status}`,
      );
    }

    const parsedData = models.basicInformation.safeParse(response.data);
    if (!parsedData.success) {
      throw new P1MeterError(
        'Basic information request failed with invalid data',
        {data: response.data as unknown, issues: parsedData.error.issues},
      );
    }

    return parsedData.data;
  }

  async system(): Promise<models.System> {
    const response = await this._axios.get('/v1/system');
    if (response.status !== 200) {
      logger.error({response}, 'Request failed with code %d', response.status);
      throw new Error('Request system failed');
    }

    return models.system.parse(response.data);
  }

  async telegram(): Promise<Telegram> {
    const response = await this._axios.get('/v1/telegram');
    if (response.status !== 200) {
      throw new P1MeterError(
        `Telegram request failed with status ${response.status}`,
      );
    }

    try {
      const apiData = models.telegram.parse(response.data);
      return parse(apiData);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new P1MeterError('Telegram request failed with invalid data', {
          data: response.data as unknown,
          issues: error.issues,
        });
      }

      throw error;
    }
  }
}

export default P1Meter;
