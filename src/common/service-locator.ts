import { MonobankClient } from '../rate/data-access/exchangers/monobank-client';
import { NBUClient } from '../rate/data-access/exchangers/nbu-client';
import { Privat24Client } from '../rate/data-access/exchangers/privat24-client';
import { BanksExchangeHandler } from '../rate/service/bank-exchange-handler';
import { SubscriptionsRepository } from '../subscription/data-access/repositories/subscription.repository';
import { SubscriptionsService } from '../subscription/service/services/subscription.service';
import { EmailService } from './services/email.service';
import { KafkaConsumer } from './services/messaging/event-consumer';
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
    emailService: async () => {
      const kafkaProducer = new KafkaConsumer(await bootstrapKafka());
      await kafkaProducer.connect();
      const emailService = new EmailService(kafkaProducer);
      await emailService.start();
      return emailService;
    },
  };
}
