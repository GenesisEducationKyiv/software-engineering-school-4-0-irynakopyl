import { SystemEvent, SystemEventType } from '../../../common/models/system-event.model';
import { serviceLocator } from '../../../common/service-locator';
import logger from '../../../common/services/logger.service';

export async function handleEvent(event: any): Promise<void> {
  logger.info(`Received event ${JSON.stringify(event)}`);
  if (!event) {
    logger.error('Empty message from Message Broker');
    return;
  }
  const eventPayload = JSON.parse(event) as SystemEvent;
  console.log('Received event:', eventPayload);
  const subscriptionService = serviceLocator().subscriptionService();

  switch (eventPayload.eventType) {
    case SystemEventType.SubscriptionCreated:
      await subscriptionService.create(eventPayload.data.email);
      break;
    case SystemEventType.SubscriptionDeleted:
      await subscriptionService.delete(eventPayload.data.email);
      break;
    default:
      console.error('Unknown event type');
  }
  return;
}
