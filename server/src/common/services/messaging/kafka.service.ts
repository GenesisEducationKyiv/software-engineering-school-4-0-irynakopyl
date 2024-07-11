import { Kafka } from 'kafkajs';
import logger from '../logger.service';
import { config } from '../../../config';

const kafka = new Kafka({
  clientId: config.messageBroker.groupId,
  brokers: [config.messageBroker.broker],
});

export async function bootstrapKafka() {
  const admin = kafka.admin();
  await admin.connect();
  const res = await admin.createTopics({
    topics: [
      { topic: config.messageBroker.topics.rate, numPartitions: 1, replicationFactor: 3 },
      { topic: config.messageBroker.topics.subscription, numPartitions: 1, replicationFactor: 3 },
    ],
  });
  logger.info(res ? 'Created new topics' : 'Topics already exist');
  await admin.disconnect();
  return kafka;
}
