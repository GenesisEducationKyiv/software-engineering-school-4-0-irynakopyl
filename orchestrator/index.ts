import express from 'express';
import { setupEventProducer } from './messaging/event-producer';
import logger from './common/logger.service';
import { bootstrapKafka } from './messaging/kafka.service';
import { setupEventConsumer } from './messaging/event-consumer';

const port = process.env.PORT || 3000;
const app = express();

async function main() {
  const kafka = await bootstrapKafka();
  const eventProducer = await setupEventProducer(kafka);
  await setupEventConsumer(kafka, eventProducer);
}

app.listen(port, async () => {
  main().catch((error) => {
    logger.info(error);
  });
  logger.info(`Running application on port ${port}`);
});
