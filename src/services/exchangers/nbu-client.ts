import axios from 'axios';
import { ExchangeClient } from '../exchanger.service';
import { config } from '../../config';
import { Currency } from '../../models/currency';

export class NBUClient implements ExchangeClient {
  private axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currency.nbu });
  }

  public async getCurrencyRate(): Promise<number> {
    const ratesResponse: { cc: Currency; rate: number }[] = await this.axiosInstance.get('/statdirectory/exchange?json');
    if (!ratesResponse?.length) {
      throw new Error('NBU currency rates API is unavailable');
    }
    const currentRate = ratesResponse.find((rateData) => {
      rateData.cc === Currency.USD;
    });
    if (!currentRate) {
      throw new Error('NBU currency rates API does not provide USD rate');
    }
    return currentRate.rate;
  }
}
