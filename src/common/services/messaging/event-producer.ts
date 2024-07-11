import { Kafka, Producer } from 'kafkajs';
import logger from '../logger.service';
import { bootstrapKafka } from './kafka.service';
import { SystemEvent, SystemEventType } from '../../models/system-event.model';
import { v4 as uuidv4 } from 'uuid';

export interface EventProducer {
  sendEvent(queueName: string, params: any): Promise<void>;
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

  async sendEvent(queueName: string, params: { data: any; eventType: SystemEventType }): Promise<void> {
    const event: SystemEvent = {
      ...params,
      timestamp: new Date(),
      eventId: uuidv4(),
    };
    const message = JSON.stringify(event);
    logger.info(`Sending message to ${queueName}: ${message}`);
    await this.producer.send({
      topic: queueName,
      messages: [{ value: message }],
    });
    await this.producer.disconnect();
  }
}
