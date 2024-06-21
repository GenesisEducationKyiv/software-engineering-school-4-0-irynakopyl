import { Currency } from '../models/currency';
import { MonobankClient } from './exchangers/monobank-client';
import { NBUClient } from './exchangers/nbu-client';
import { Privat24Client } from './exchangers/privat24-client';

export interface Rate {
  rate: number;
}

export interface ExchangeClient {
  getCurrencyRate(): Promise<number>;
}

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
      return await this.exchangeClient.getCurrencyRate();
    } catch (error) {
      if (this.nextHandler) {
        return this.nextHandler.getCurrencyRate();
      } else {
        throw new Error('All currency rate services are unavailable');
      }
    }
  }
}

export class ExchangerService {
  private exchangerHandler: BanksExchangeHandler;
  constructor() {
    const privat24Handler = new BanksExchangeHandler(new Privat24Client());
    const monobankHandler = new BanksExchangeHandler(new MonobankClient());
    const nbuHandler = new BanksExchangeHandler(new NBUClient());
    monobankHandler.setNext(nbuHandler);
    privat24Handler.setNext(monobankHandler);
    this.exchangerHandler = privat24Handler;
  }

  public async getCurrentRate(): Promise<number> {
    return this.exchangerHandler.getCurrencyRate();
  }
}
