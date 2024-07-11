import { RatesRepository } from '../notification/data-access/repositories/rate.repository';
import { RatesService } from '../notification/services/rate.service';
import { EmailService } from '../notification/services/email.service';
import { MonobankClient } from '../rate/data-access/exchangers/monobank-client';
import { NBUClient } from '../rate/data-access/exchangers/nbu-client';
import { Privat24Client } from '../rate/data-access/exchangers/privat24-client';
import { BanksExchangeHandler } from '../rate/service/bank-exchange-handler';
import { ExchangerService } from '../rate/service/exchanger.service';
import { SubscriptionsRepository } from '../subscription/data-access/repositories/subscription.repository';
import { SubscriptionsService } from '../subscription/service/services/subscription.service';
import { KafkaConsumer } from './services/messaging/event-consumer';
import { KafkaProducer } from './services/messaging/event-producer';
import { bootstrapKafka } from './services/messaging/kafka.service';

export function serviceLocator() {
  return {
    subscriptionService: () => {
      return new SubscriptionsService(new SubscriptionsRepository());
    },
    banksExchangeHandler: () => {
      const monobankHandler = new BanksExchangeHandler(new MonobankClient());
      const nbuHandler = new BanksExchangeHandler(new NBUClient());
      const privat24Handler = new BanksExchangeHandler(new Privat24Client());
      return monobankHandler.setNext(nbuHandler).setNext(privat24Handler);
    },
    exchangerService: () => {
      return new ExchangerService(serviceLocator().banksExchangeHandler());
    },
    ratesService: () => {
      return new RatesService(new RatesRepository());
    },
    emailService: async () => {
      const emailService = new EmailService(await serviceLocator().eventConsumer(), serviceLocator().ratesService());
      await emailService.start();
      return emailService;
    },
    eventConsumer: async () => {
      const kafkaConsumer = new KafkaConsumer(await bootstrapKafka());
      await kafkaConsumer.connect();
      return kafkaConsumer;
    },
    eventProducer: async () => {
      const kafkaProducer = new KafkaProducer(await bootstrapKafka());
      await kafkaProducer.connect();
      return kafkaProducer;
    },
    rateFetcher: async () => {
      const eventProducer = await serviceLocator().eventProducer();
      const exchangerService = serviceLocator().exchangerService();
      exchangerService.provideScheduledRateUpdates(eventProducer);
      return exchangerService;
    },
  };
}
