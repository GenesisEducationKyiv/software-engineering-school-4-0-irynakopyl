import { SystemEvent, SystemEventType } from '../../../common/models/system-event.model';
import { RatesRepository } from '../../data-access/repositories/rate.repository';
import { Currency } from '../models/currency';
import { RateService } from './rate.service';

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
  const rateRepository = new RateService(new RatesRepository());
  await rateRepository.create(data.currencyRate, Currency.USD);
}
