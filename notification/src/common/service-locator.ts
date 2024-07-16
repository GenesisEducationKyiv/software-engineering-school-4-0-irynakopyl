import { RatesRepository } from '../rate/data-access/repositories/rate.repository';
import { RateService } from '../rate/service/services/rate.service';
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
    ratesService: () => {
      return new RateService(new RatesRepository());
    },
    emailService: () => {
      const emailService = new EmailService();
      return emailService;
    },
    eventConsumer: async () => {
      const kafkaConsumer = new KafkaConsumer(await bootstrapKafka());
      await kafkaConsumer.connect();
      return kafkaConsumer;
    },
  };
}
