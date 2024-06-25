import axios from 'axios';
import { ExchangeClient } from '../exchanger.service';
import { config } from '../../config';
import { Currency } from '../../models/currency';
import logger from '../logger.service';

export class NBUClient implements ExchangeClient {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currency.nbu });
  }

  public async getCurrencyRate(): Promise<number> {
    const ratesResponse = await this.axiosInstance.get('/statdirectory/exchange?json');
    logger.info(`[NBU API] Responded with status ${ratesResponse?.status} Data: ${JSON.stringify(ratesResponse?.data)}`);

    if (!ratesResponse?.data) {
      throw new Error('NBU currency rates API is unavailable');
    }
    const currentRate = ratesResponse.data.find((rateData: { cc: Currency; rate: number }) => rateData.cc === Currency.USD);
    if (!currentRate) {
      throw new Error('NBU currency rates API does not provide USD rate');
    }
    return currentRate.rate;
  }
}
