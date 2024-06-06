import axios from 'axios';
import { config } from '../config';
import { Currency } from '../models/currency';

interface CurrencyRateApiResponse {
  ccy: Currency;
  base_ccy: Currency;
  buy: number;
  sale: number;
}

export class ExchangerService {
  public static async getCurrentRate(): Promise<number | undefined> {
    try {
      const ratesResponse = await axios.get(config.api.currencyUrl);
      if (!ratesResponse) {
        return;
      }
      const allCurrentRates: CurrencyRateApiResponse[] = ratesResponse.data;
      return allCurrentRates.find((row) => row.ccy === Currency.USD)?.sale;
    } catch (error) {
      console.log('Error while retrieving currency exchange rate', error);
      return;
    }
  }
}
