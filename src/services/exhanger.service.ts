import { Currency } from '../models/currency';

export interface Rate {
  ccy: string;
  buy: number;
  sale: number;
}

export interface ExchangeClientInterface {
  getCurrencyRates(): Promise<Rate[]>;
}

export class ExchangerService {
  constructor(private exchangeClient: ExchangeClientInterface) {}

  public async getCurrentRate(currency: Currency): Promise<number> {
    const allCurrentRates: Rate[] = await this.exchangeClient.getCurrencyRates();

    const currentRate = allCurrentRates.find((row) => row.ccy === currency)?.sale;
    if (!currentRate) {
      throw new Error(`Service does not have information about current currency rate ${currency}`);
    }
    return currentRate;
  }
}
