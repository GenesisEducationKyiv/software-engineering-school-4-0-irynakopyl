import { SystemEvent, SystemEventType } from '../../common/models/system-event.model';
import { serviceLocator } from '../../common/service-locator';
import logger from '../../common/services/logger.service';

export async function handleEvent(event: any): Promise<void> {
  logger.debug(`Received event ${JSON.stringify(event)}`);
  if (!event?.message?.value) {
    logger.warn('Empty message from Message Broker');
    return;
  }
  const eventPayload = JSON.parse(event.message.value.toString()) as SystemEvent;
  switch (eventPayload.eventType) {
    case SystemEventType.CustomerCreated:
      await processCustomerCreated(eventPayload.data);
      break;
    default:
      logger.warn('Unknown event type');
  }
  return;
}

async function processCustomerCreated(data: { email: string }): Promise<void> {
  const subscriptionService = await serviceLocator().subscriptionService();
  await subscriptionService.update(data.email, { isSetupDone: true });
}
