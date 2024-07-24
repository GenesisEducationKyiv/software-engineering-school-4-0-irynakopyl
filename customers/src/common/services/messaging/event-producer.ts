import { Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { SystemEvent } from '../../models/system-event.model';
import logger from '../logger.service';

export interface EventProducer {
  sendEvent(queueName: string, event: Pick<SystemEvent, 'data' | 'eventType'>): Promise<void>;
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

  async sendEvent(queueName: string, event: Pick<SystemEvent, 'data' | 'eventType'>): Promise<void> {
    logger.debug(`Sending system event to ${queueName}: ${JSON.stringify(event)}`);
    try {
      const systemEvent = {
        ...event,
        eventId: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      const message = JSON.stringify(systemEvent);
      logger.debug(`Sending message to ${queueName}: ${message}`);
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
