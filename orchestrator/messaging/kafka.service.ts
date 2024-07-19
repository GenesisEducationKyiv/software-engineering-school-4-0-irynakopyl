import { Kafka, logLevel } from 'kafkajs';
import { config } from '../config';
import logger from '../common/logger.service';

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
    topics: [
      { topic: config.messageBroker.topics.customer },
      { topic: config.messageBroker.topics.subscription },
      { topic: config.messageBroker.topics.customersTransaction },
    ],
  });
  logger.info(res ? 'Created new topics' : 'Topics already exist');
  await admin.disconnect();
  return kafka;
}

//bootstrapKafka().catch((err) => console.log(JSON.stringify(err)));
