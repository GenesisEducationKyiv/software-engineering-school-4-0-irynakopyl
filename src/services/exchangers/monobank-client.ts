import axios from 'axios';
import { config } from '../../config';
import { ExchangeClient } from '../exchanger.service';
import { ISO4217CurrencyCodes } from '../../models/currency';
import logger from '../logger.service';
import * as _ from 'lodash';

export class MonobankClient implements ExchangeClient {
  private axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currency.mono });
  }

  public async getCurrencyRate(): Promise<number> {
    const ratesResponse = await this.axiosInstance.get('');
    logger.info(`[Monobank API] Responded with status ${ratesResponse?.status} Data: ${JSON.stringify(ratesResponse?.data)}`);

    if (!ratesResponse?.data) {
      throw new Error('Monobank currency rates API is unavailable');
    }
    const currentRate = _.find(
      ratesResponse.data,
      (rateData) => rateData.currencyCodeA === ISO4217CurrencyCodes.USD && rateData.currencyCodeB === ISO4217CurrencyCodes.UAH,
    );
    if (!currentRate) {
      throw new Error('Monobank currency rates API does not provide USD rate');
    }
    return currentRate.rateSell;
  }
}
