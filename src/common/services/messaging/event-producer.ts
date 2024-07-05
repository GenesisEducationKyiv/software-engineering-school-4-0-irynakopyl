import { Kafka, Producer } from 'kafkajs';
import logger from '../logger.service';
import { bootstrapKafka } from './kafka.service';
import { SystemEvent } from '../../models/system-event.model';

export interface EventProducer {
  sendEvent(queueName: string, event: SystemEvent): Promise<void>;
  shutdown(): Promise<void>;
}

export const setupEventProducer = async (): Promise<EventProducer> => {
  const kafkaProducer = new KafkaProducer(await bootstrapKafka());
  await kafkaProducer.connect();
  return kafkaProducer;
};

export class KafkaProducer implements EventProducer {
  private readonly producer: Producer;

  constructor(private readonly kafka: Kafka) {
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    logger.info('Connecting to Kafka producer...');
    await this.producer.connect();
  }

  async sendEvent(queueName: string, event: SystemEvent): Promise<void> {
    const message = JSON.stringify(event);
    logger.info(`Sending message to ${queueName}: ${message}`);
    await this.producer.send({
      topic: queueName,
      messages: [{ value: message }],
    });
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Kafka producer...');
    await this.producer.disconnect();
  }
}
