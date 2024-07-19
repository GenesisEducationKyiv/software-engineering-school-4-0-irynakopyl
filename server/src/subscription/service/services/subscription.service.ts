import { SystemEventType } from '../../../common/models/system-event.model';
import logger from '../../../common/services/logger.service';
import { EventProducer } from '../../../common/services/messaging/event-producer';
import { config } from '../../../config';
import { Subscription } from '../models/subscription';

export interface SubscriptionRepository {
  create(email: string): Promise<Subscription>;
  getAll(config?: { limit?: number; startingBefore?: Date }): Promise<Subscription[]>;
  findByEmail(email: string): Promise<Subscription | null>;
  update(email: string, params: Pick<Subscription, 'isSetupDone'>): Promise<void>;
  delete(email: string): Promise<void>;
}

export class SubscriptionsService {
  constructor(
    private repository: SubscriptionRepository,
    private eventProducer: EventProducer,
  ) {}

  public async create(email: string): Promise<Subscription> {
    const subscription = await this.repository.create(email);

    logger.info(`Subscription created for ${email}, sending event to queue`);
    await this.eventProducer.sendEvent(config.messageBroker.topics.subscription, {
      data: { email },
      eventType: SystemEventType.SubscriptionCreated,
    });

    await this.eventProducer.sendEvent(config.messageBroker.topics.notification, {
      data: { email },
      eventType: SystemEventType.SubscriptionCreated,
    });

    return subscription;
  }

  public async update(email: string, params: Pick<Subscription, 'isSetupDone'>): Promise<void> {
    await this.repository.update(email, params);
  }

  public async findByEmail(email: string): Promise<Subscription | null> {
    return this.repository.findByEmail(email);
  }

  public async getAll(config?: { limit?: number; createdAfter?: Date }): Promise<Subscription[]> {
    return this.repository.getAll(config);
  }

  public async delete(email: string): Promise<void> {
    await this.repository.delete(email);
    await this.eventProducer.sendEvent(config.messageBroker.topics.subscription, {
      data: { email },
      eventType: SystemEventType.SubscriptionDeleted,
    });
    return;
  }
}
