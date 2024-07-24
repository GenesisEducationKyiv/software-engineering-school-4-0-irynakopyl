import { processCustomerCreated } from '../event-handlers/customers-events.handler';
import { processSubscriptionCreated } from '../event-handlers/subscription-event.handler';
import { SystemEvent, SystemEventType } from '../common/system-event.model';
import { EventProducer } from './event-producer';
import logger from '../common/logger.service';

export async function handleEvent(
  event: any,
  eventProducer: any
): Promise<void> {
  logger.debug(`Received event ${JSON.stringify(event)}`);
  if (!event) {
    logger.error('Empty message from Message Broker');
    return;
  }
  const eventPayload = JSON.parse(event) as SystemEvent;
  switch (eventPayload.eventType) {
    case SystemEventType.SubscriptionCreated:
      await processSubscriptionCreated(eventPayload.data, eventProducer);
      break;
    case SystemEventType.CustomerCreated:
      await processCustomerCreated(eventPayload.data, eventProducer);
      break;
    default:
      logger.error('Unknown event type');
  }
  return;
}
