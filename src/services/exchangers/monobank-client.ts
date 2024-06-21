import axios from 'axios';
import { config } from '../../config';
import { ExchangeClient } from '../exchanger.service';
import { ISO4217CurrencyCodes } from '../../models/currency';

export class MonobankClient implements ExchangeClient {
  private axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currency.mono });
  }

  public async getCurrencyRate(): Promise<number> {
    const ratesResponse: { currencyCodeA: number; currencyCodeB: number; rateSell: number }[] = await this.axiosInstance.get('');
    if (!ratesResponse?.length) {
      throw new Error('Monobank currency rates API is unavailable');
    }
    const currentRate = ratesResponse.find(
      (rateData) => rateData.currencyCodeA === ISO4217CurrencyCodes.USD && rateData.currencyCodeB === ISO4217CurrencyCodes.UAH,
    );
    if (!currentRate) {
      throw new Error('Monobank currency rates API does not provide USD rate');
    }
    return currentRate.rateSell;
  }
}
