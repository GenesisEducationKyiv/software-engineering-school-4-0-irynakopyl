import axios from 'axios';
import { ExchangeClient } from '../exchanger.service';
import { config } from '../../config';
import { Currency } from '../../models/currency';
import * as _ from 'lodash';
import logger from '../logger.service';

export class Privat24Client implements ExchangeClient {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currency.privat });
  }

  public async getCurrencyRate(): Promise<number> {
    const ratesResponse = await this.axiosInstance.get('');
    logger.info(`[Privat24 API] Responded with status ${ratesResponse?.status} Data: ${JSON.stringify(ratesResponse?.data)}`);
    if (!ratesResponse?.data) {
      throw new Error('Privat24 currency rates API is unavailable');
    }
    const currentRate = _.find(ratesResponse.data, (rateData) => rateData.ccy === Currency.USD);
    if (!currentRate) {
      throw new Error('Privat24 currency rates API does not provide USD rate');
    }
    return currentRate.sale;
  }
}
