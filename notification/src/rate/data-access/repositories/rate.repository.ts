import Rate from '../../../common/db/models/rate.model';
import { Currency } from '../../../rate/service/models/currency';
import { RateRepository } from '../../service/services/rate.service';

export class RatesRepository implements RateRepository {
  public async create(value: number, currency: Currency): Promise<Rate> {
    return Rate.create({ currency, createdAt: new Date(), value });
  }

  public async getLatest(currency: Currency) {
    return Rate.findOne({ where: { currency }, order: [['createdAt', 'DESC']] });
  }
}
