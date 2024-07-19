import { Consumer, Kafka } from 'kafkajs';
import { config } from '../../../config';
import { bootstrapKafka } from './kafka.service';

export interface EventConsumer {
  addEventHandler(queueName: string, handler: (payload: any) => Promise<void>): Promise<void>;
  disconnect(): Promise<void>;
}

export const setupEventConsumer = async (): Promise<EventConsumer> => {
  const kafkaProducer = new KafkaConsumer(await bootstrapKafka());
  await kafkaProducer.connect();
  return kafkaProducer;
};

export class KafkaConsumer implements EventConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: config.messageBroker.groupId });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async addEventHandler(queueName: string, handler: any): Promise<void> {
    await this.consumer.subscribe({ topic: queueName, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Received message', {
          topic,
          partition,
          key: message?.key?.toString(),
          value: message?.value?.toString(),
        });
        await handler(message?.value?.toString());
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
