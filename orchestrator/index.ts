import express from 'express';
import { setupEventProducer } from './messaging/event-producer';
import logger from './common/logger.service';
import { bootstrapKafka } from './messaging/kafka.service';
import { setupEventConsumer } from './messaging/event-consumer';
import metricsRegister from './common/metrics/registry';

const port = process.env.PORT || 3000;
const app = express();

async function main() {
  const kafka = await bootstrapKafka();
  const eventProducer = await setupEventProducer(kafka);
  await setupEventConsumer(kafka, eventProducer);
}

app.get('/metrics', async (req, res, next) => {
  res.setHeader('Content-type', metricsRegister.contentType);
  res.send(await metricsRegister.metrics());
  next();
});

app.listen(port, async () => {
  main().catch((error) => {
    logger.error(error);
  });
  logger.info(`Running application on port ${port}`);
});
