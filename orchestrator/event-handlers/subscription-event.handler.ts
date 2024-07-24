import { config } from '../config';
import { EventProducer, setupEventProducer } from '../messaging/event-producer';
import logger from '../common/logger.service';
import { SystemEventType } from '../common/system-event.model';
import { bootstrapKafka } from '../messaging/kafka.service';

export async function processSubscriptionCreated(
  data: {
    email: number;
  },
  eventProducer: any
): Promise<void> {
  logger.debug(
    `Sending customer create command with payload: ${JSON.stringify(data)}`
  );
  eventProducer.sendEvent(config.messageBroker.topics.customer, {
    eventType: SystemEventType.CreateCustomer,
    data,
  });
}
