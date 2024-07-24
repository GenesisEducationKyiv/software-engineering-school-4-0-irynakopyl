import { config } from '../config';
import { EventProducer } from '../messaging/event-producer';
import logger from '../common/logger.service';
import { SystemEventType } from '../common/system-event.model';

export async function processCustomerCreated(
  data: {
    email: number;
  },
  eventProducer: EventProducer
): Promise<void> {
  logger.info(
    `Sending customer created event with payload: ${JSON.stringify(data)}`
  );
  await eventProducer.sendEvent(
    config.messageBroker.topics.subscriptionTransaction,
    {
      eventType: SystemEventType.CustomerCreated,
      data,
    }
  );
}
