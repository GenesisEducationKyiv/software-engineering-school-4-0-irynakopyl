import events_sent_total from '../../../common/metrics/events-sent';
import { SystemEventType } from '../../../common/models/system-event.model';
import { EventProducer } from '../../../common/services/messaging/event-producer';
import { config } from '../../../config';
import { Customer } from '../models/customer';

export interface CustomerRepository {
  create(email: string): Promise<Customer>;
  delete(email: string): Promise<void>;
}

export class CustomerService {
  constructor(
    private repository: CustomerRepository,
    private eventProducer: EventProducer,
  ) {}

  public async create(email: string): Promise<Customer> {
    const customer = await this.repository.create(email);
    const event = {
      data: { email },
      eventType: SystemEventType.CustomerCreated,
    };
    await this.eventProducer.sendEvent(config.messageBroker.topics.customersTransaction, event);
    events_sent_total.inc({ topic: config.messageBroker.topics.customersTransaction, event: JSON.stringify(event) });
    return customer;
  }

  public async delete(email: string): Promise<void> {
    return this.repository.delete(email);
  }
}
