export interface ExchangeClient {
  getCurrencyRate(): Promise<number>;
}

export class ExchangerService {
  constructor(private exchangerHandler: ExchangeClient) {}

  public async getCurrentRate(): Promise<number> {
    return this.exchangerHandler.getCurrencyRate();
  }
}
