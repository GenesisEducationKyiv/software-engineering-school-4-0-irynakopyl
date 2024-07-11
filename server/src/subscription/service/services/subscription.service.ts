import { SystemEventType } from '../../../common/models/system-event.model';
import logger from '../../../common/services/logger.service';
import { EventProducer, setupEventProducer } from '../../../common/services/messaging/event-producer';
import { config } from '../../../config';
import { Subscription } from '../models/subscription';
import { v4 as uuidv4 } from 'uuid';

export interface SubscriptionRepository {
  create(email: string): Promise<Subscription>;
  getAll(config?: { limit?: number; startingBefore?: Date }): Promise<Subscription[]>;
  findByEmail(email: string): Promise<Subscription | null>;
  delete(email: string): Promise<void>;
}

export class SubscriptionsService {
  constructor(private repository: SubscriptionRepository) {}

  public async create(email: string): Promise<Subscription> {
    const subscription = await this.repository.create(email);
    const eventProducer = await setupEventProducer();

    logger.info(`Subscription created for ${email}, sending event to queue`);
    await eventProducer.sendEvent(config.messageBroker.topics.subscription, {
      data: { email },
      timestamp: new Date(),
      eventId: uuidv4(),
      eventType: SystemEventType.SubscriptionCreated,
    });

    return subscription;
  }

  public async findByEmail(email: string): Promise<Subscription | null> {
    return this.repository.findByEmail(email);
  }

  public async getAll(config?: { limit?: number; createdAfter?: Date }): Promise<Subscription[]> {
    return this.repository.getAll(config);
  }

  public async delete(email: string): Promise<void> {
    await this.repository.delete(email);
    // await this.eventProducer.sendEvent(config.messageBroker.topics.subscription, {
    //   data: { email },
    //   timestamp: new Date(),
    //   eventId: uuidv4(),
    //   eventType: SystemEventType.SubscriptionDeleted,
    // });
    return;
  }
}
