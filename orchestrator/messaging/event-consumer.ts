import { Consumer, EachMessageHandler, Kafka } from 'kafkajs';
import { config } from '../config';
import * as eventHandler from './event-handler';
import { EventProducer } from './event-producer';
import logger from '../common/logger.service';

export interface EventConsumer {
  addEventHandler(handler: (payload: any) => Promise<void>): Promise<void>;
  subscribe(topics: string[]): Promise<void>;
  disconnect(): Promise<void>;
}

export async function setupEventConsumer(
  kafka: Kafka,
  eventProducer: EventProducer
) {
  const eventConsumer = new KafkaConsumer(kafka);
  logger.info(`Connecting to event consumer`);
  await eventConsumer.connect();
  await eventConsumer.subscribe([
    config.messageBroker.topics.subscription,
    config.messageBroker.topics.customersTransaction,
  ]);
  await eventConsumer.addEventHandler(async (event: any) => {
    await eventHandler.handleEvent(event, eventProducer);
  });
  logger.info(`Added event handler`);
}

export class KafkaConsumer implements EventConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({
      groupId: config.messageBroker.groupId,
    });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async subscribe(topics: string[]): Promise<void> {
    await this.consumer.subscribe({ topics: topics, fromBeginning: true });
  }

  async addEventHandler(handler: any): Promise<void> {
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
