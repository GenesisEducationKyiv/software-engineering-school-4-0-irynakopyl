import Subscription from '../db/models/subscription.model';

export interface SubscriptionRepository {
  create(email: string): Promise<Subscription>;
  getAll(): Promise<Subscription[]>;
  findByEmail(email: string): Promise<Subscription | null>;
}

export class SubscriptionsService {
  constructor(private repository: SubscriptionRepository) {}
  public async create(email: string): Promise<Subscription> {
    return this.repository.create(email);
  }

  public async findByEmail(email: string): Promise<Subscription | null> {
    return this.repository.findByEmail(email);
  }

  public async getAll(): Promise<Subscription[]> {
    return this.repository.getAll();
  }
}
