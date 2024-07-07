import { KafkaProducer } from '../../../common/services/messaging/event-producer';
import { bootstrapKafka } from '../../../common/services/messaging/kafka.service';
import { MonobankClient } from '../../data-access/exchangers/monobank-client';
import { NBUClient } from '../../data-access/exchangers/nbu-client';
import { Privat24Client } from '../../data-access/exchangers/privat24-client';
import { BanksExchangeHandler } from '../../service/bank-exchange-handler';
import { ExchangerService } from '../../service/exchanger.service';

export async function setupRateFetcher(): Promise<ExchangerService> {
  const monobankHandler = new BanksExchangeHandler(new MonobankClient());
  const nbuHandler = new BanksExchangeHandler(new NBUClient());
  const privat24Handler = new BanksExchangeHandler(new Privat24Client());
  const bankExchangeHandler = monobankHandler.setNext(nbuHandler).setNext(privat24Handler);

  const eventProducer = new KafkaProducer(await bootstrapKafka());
  const exchangerService = new ExchangerService(bankExchangeHandler);
  exchangerService.provideScheduledRateUpdates(eventProducer);
  return exchangerService;
}
