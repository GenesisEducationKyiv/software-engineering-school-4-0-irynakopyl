import { SystemEvent, SystemEventType } from '../../../common/models/system-event.model';
import { serviceLocator } from '../../../common/service-locator';
import { Currency } from '../models/currency';

export async function handleEvent(event: any): Promise<void> {
  console.log('Received event', JSON.stringify(event));
  if (!event?.message?.value) {
    console.error('Empty message from Message Broker');
    return;
  }
  const eventPayload = JSON.parse(event.message.value.toString()) as SystemEvent;
  console.log('Received event:', eventPayload);
  switch (eventPayload.eventType) {
    case SystemEventType.CurrencyRateUpdated:
      await processCurrencyUpdated(eventPayload.data);
      break;
    default:
      console.error('Unknown event type');
  }
  return;
}

async function processCurrencyUpdated(data: { currencyRate: number }): Promise<void> {
  const rateRepository = serviceLocator().ratesService();
  await rateRepository.create(data.currencyRate, Currency.USD);
}
