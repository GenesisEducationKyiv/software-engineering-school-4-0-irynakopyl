import { Kafka } from 'kafkajs';
import logger from '../logger.service';
import { config } from '../../../config';

const kafka = new Kafka({
  clientId: config.messageBroker.groupId,
  brokers: [config.messageBroker.broker],
});

export async function bootstrapKafka() {
  logger.info(`Setting up kafka connection to ${config.messageBroker.broker}`);
  const kafka = new Kafka({
    brokers: [config.messageBroker.broker],
    clientId: config.messageBroker.groupId,
    connectionTimeout: 10000,
  });
  const admin = kafka.admin();
  await admin.connect();
  const res = await admin.createTopics({
    topics: [{ topic: config.messageBroker.topics.customers }, { topic: config.messageBroker.topics.customersTransaction }],
  });
  logger.info(res ? 'Created new topics' : 'Topics already exist');
  await admin.disconnect();
  return kafka;
}
