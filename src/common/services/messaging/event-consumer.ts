import { Consumer, EachMessageHandler, Kafka } from 'kafkajs';
import { config } from '../../../config';

export interface EventConsumer {
  addEventHandler(queueName: string, handler: (payload: any) => Promise<void>): Promise<void>;
  disconnect(): Promise<void>;
}

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

  async addEventHandler(queueName: string, handler: EachMessageHandler): Promise<void> {
    await this.consumer.subscribe({ topic: queueName, fromBeginning: true });
    await this.consumer.run({
      eachMessage: handler,
    });
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
