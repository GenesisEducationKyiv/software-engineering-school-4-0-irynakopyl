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
    await this.eventProducer.sendEvent(config.messageBroker.topics.customersTransaction, {
      data: { email },
      eventType: SystemEventType.CustomerCreated,
    });
    return customer;
  }

  public async delete(email: string): Promise<void> {
    return this.repository.delete(email);
  }
}
