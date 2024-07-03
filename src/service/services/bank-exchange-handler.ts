import { ExchangeClient } from './exchanger.service';

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
