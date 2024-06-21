import axios from 'axios';
import { ExchangeClient } from '../exchanger.service';
import { config } from '../../config';
import { Currency } from '../../models/currency';

export class Privat24Client implements ExchangeClient {
  private axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currency.privat });
  }

  public async getCurrencyRate(): Promise<number> {
    console.log('Privat24Client.getCurrencyRate');
    const ratesResponse = await this.axiosInstance.get('');
    if (!ratesResponse?.data) {
      throw new Error('Currency rates API is unavailable');
    }
    const currentRate = ratesResponse.data.find((rateData: { ccy: string; sale: number }) => {
      rateData.ccy === Currency.USD;
    });
    if (!currentRate) {
      throw new Error('Privat24 currency rates API does not provide USD rate');
    }
    return currentRate.sale;
  }
}
