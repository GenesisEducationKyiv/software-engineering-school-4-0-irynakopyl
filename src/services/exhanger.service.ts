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
  public static async getCurrentRate(): Promise<number> {
    const ratesResponse = await axios.get(config.api.currencyUrl);
    if (!ratesResponse || !ratesResponse.data) {
      throw new Error(`Currency rates API is unavailable`);
    }
    const allCurrentRates: CurrencyRateApiResponse[] = ratesResponse.data;
    const usdRate = allCurrentRates.find((row) => row.ccy === Currency.USD)?.sale;
    if (!usdRate) {
      throw new Error(`Service does not have information about current currency rate`);
    }
    return usdRate;
  }
}
