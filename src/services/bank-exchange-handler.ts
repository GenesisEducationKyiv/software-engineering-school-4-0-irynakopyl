import { ExchangeClient } from './exchanger.service';
import { MonobankClient } from './exchangers/monobank-client';
import { NBUClient } from './exchangers/nbu-client';
import { Privat24Client } from './exchangers/privat24-client';

interface ExchangeHandler extends ExchangeClient {
  setNext(handler: ExchangeHandler): ExchangeHandler;
}

export class BanksExchangeHandler implements ExchangeHandler {
  constructor(private exchangeClient: ExchangeClient) {}

  private nextHandler: ExchangeHandler;

  setNext(handler: ExchangeHandler): ExchangeHandler {
    this.nextHandler = handler;
    return handler;
  }

  async getCurrencyRate(): Promise<number> {
    try {
      const rate = await this.exchangeClient.getCurrencyRate();
      return rate;
    } catch (error) {
      if (this.nextHandler) {
        return this.nextHandler.getCurrencyRate();
      } else {
        throw new Error('All currency rate services are unavailable');
      }
    }
  }
}
const monobankHandler = new BanksExchangeHandler(new MonobankClient());
const nbuHandler = new BanksExchangeHandler(new NBUClient());
const privat24Handler = new BanksExchangeHandler(new Privat24Client());
const ukrainianBankExchangeHandler = monobankHandler.setNext(nbuHandler).setNext(privat24Handler);
export default ukrainianBankExchangeHandler;
