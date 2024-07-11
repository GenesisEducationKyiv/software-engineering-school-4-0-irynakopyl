import Subscriptions from '../../../common/db/models/subscription.model';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionRepository } from '../../service/services/subscription.service';
import { Op } from 'sequelize';
import { Subscription } from '../../service/models/subscription';

export class SubscriptionsRepository implements SubscriptionRepository {
  public async create(email: string): Promise<Subscription> {
    return Subscriptions.create({ id: uuidv4(), createdAt: new Date(), email });
  }

  public async findByEmail(email: string): Promise<Subscription | null> {
    return Subscriptions.findOne({ where: { email: email } });
  }

  public async getAll(config?: { limit: number; createdAfter: Date }): Promise<Subscription[]> {
    return Subscriptions.findAll({
      order: [['createdAt', 'ASC']],
      ...(config?.createdAfter
        ? {
            createdAt: {
              [Op.gt]: config?.createdAfter,
            },
          }
        : undefined),
      where: {
        ...(config?.createdAfter
          ? {
              createdAt: {
                [Op.gt]: config?.createdAfter,
              },
            }
          : undefined),
      },
      ...(config?.limit
        ? {
            limit: config.limit,
          }
        : undefined),
    });
  }
}
