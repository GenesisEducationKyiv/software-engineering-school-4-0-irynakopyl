import { Kafka, Producer } from 'kafkajs';
import logger from '../logger.service';
import { SystemEvent } from '../../models/system-event.model';

export interface EventProducer {
  sendEvent(queueName: string, event: SystemEvent): Promise<void>;
  connect(): Promise<void>;
}

export class KafkaProducer implements EventProducer {
  private readonly producer: Producer;

  constructor(private kafka: Kafka) {
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    logger.info('Connecting to Kafka producer...');
    await this.producer.connect();
  }

  async sendEvent(queueName: string, event: SystemEvent): Promise<void> {
    logger.info(`Sending system event to ${queueName}: ${JSON.stringify(event)}`);
    try {
      await this.kafka.producer().connect();
      const message = JSON.stringify(event);
      logger.info(`Sending message to ${queueName}: ${message}`);
      await this.producer.send({
        topic: queueName,
        messages: [{ value: message }],
      });
    } catch (e) {
      logger.error(`Error sending message to ${queueName}: ${e}`);
      throw e;
    }
  }

  async disconnect(): Promise<void> {
    logger.info('Disconnecting from Kafka producer...');
    await this.producer.disconnect();
  }
}