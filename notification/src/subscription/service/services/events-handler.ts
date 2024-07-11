import { SystemEvent, SystemEventType } from '../../../common/models/system-event.model';
import { SubscriptionsRepository } from '../../data-access/repositories/subscription.repository';
import { SubscriptionsService } from './subscription.service';

export async function handleEvent(event: any): Promise<void> {
  console.log('Received event', JSON.stringify(event));
  if (!event?.message?.value) {
    console.error('Empty message from Message Broker');
    return;
  }
  const eventPayload = JSON.parse(event.message.value.toString()) as SystemEvent;
  console.log('Received event:', eventPayload);
  const subscriptionService = new SubscriptionsService(new SubscriptionsRepository());

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
