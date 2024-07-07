import { Currency } from '../../rate/service/models/currency';
import { Rate } from '../../rate/service/models/rate.model';

export interface RateRepository {
  create(value: number, currency: Currency): Promise<Rate>;
  getLatest(currency: Currency): Promise<Rate | null>;
}

export class RateService {
  constructor(private repository: RateRepository) {}
  public async create(value: number, currency: Currency): Promise<Rate> {
    return this.repository.create(value, currency);
  }

  public async getLatest(currency: Currency): Promise<Rate | null> {
    return this.repository.getLatest(currency);
  }
}
