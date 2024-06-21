import Subscription from '../db/models/subscription.model';
import { v4 as uuidv4 } from 'uuid';

export interface Repository<T> {
  create(email: string): Promise<T>;
  getAll(): Promise<T[]>;
}

export class SubscriptionsRepository implements Repository<Subscription> {
  public async create(email: string): Promise<Subscription> {
    return Subscription.create({ id: uuidv4(), createdAt: new Date(), email });
  }

  public async findByEmail(email: string): Promise<Subscription | null> {
    return Subscription.findOne({ where: { email: email } });
  }

  public async getAll(): Promise<Subscription[]> {
    return Subscription.findAll({ attributes: ['email'] });
  }
}
