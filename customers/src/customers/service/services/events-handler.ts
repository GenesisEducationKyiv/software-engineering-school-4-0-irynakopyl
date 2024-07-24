import { SystemEvent, SystemEventType } from '../../../common/models/system-event.model';
import { serviceLocator } from '../../../common/service-locator';

export async function handleEvent(event: any): Promise<void> {
  console.log('Received event', JSON.stringify(event));
  if (!event) {
    console.error('Empty message from Message Broker');
    return;
  }
  const eventPayload = JSON.parse(event) as SystemEvent;
  console.log('Received event:', eventPayload);
  const customerService = await serviceLocator().customerService();

  switch (eventPayload.eventType) {
    case SystemEventType.CustomerCreate:
      await customerService.create(eventPayload.data.email);
      break;
    case SystemEventType.CustomerDeleted:
      await customerService.delete(eventPayload.data.email);
      break;
    default:
      console.error('Unknown event type');
  }
  return;
}
