import axios from 'axios';
import { ExchangeClientInterface, Rate } from '../exchanger.service';
import { config } from '../../config';

export class Privat24Client implements ExchangeClientInterface {
  private axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: config.api.currencyUrl });
  }

  public async getCurrencyRates(): Promise<Rate[]> {
    const ratesResponse = await this.axiosInstance.get('');
    if (!ratesResponse?.data) {
      throw new Error('Currency rates API is unavailable');
    }
    return ratesResponse.data as Rate[];
  }
}
