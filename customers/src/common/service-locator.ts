import { CustomerService } from '../customers/service/services/customer.service';
import { KafkaConsumer } from './services/messaging/event-consumer';
import { bootstrapKafka } from './services/messaging/kafka.service';
import { CustomersRepository } from '../customers/data-access/repositories/customer.repository';
import { KafkaProducer } from './services/messaging/event-producer';

export function serviceLocator() {
  return {
    customerService: async () => {
      return new CustomerService(new CustomersRepository(), await serviceLocator().eventProducer());
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
  };
}
