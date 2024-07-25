import express from 'express';
import { config } from './config';
import { exit } from 'process';
import { DatabaseService } from './common/services/database.service';
import * as bodyParser from 'body-parser';
import logger from './common/services/logger.service';
import * as customersEventHandler from './customers/service/services/events-handler';
import { serviceLocator } from './common/service-locator';
import events_received_total from './common/metrics/events-received';
import metricsRegister from './common/metrics/registry';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/metrics', async (req, res, next) => {
  res.setHeader('Content-type', metricsRegister.contentType);
  res.send(await metricsRegister.metrics());
  next();
});

export async function initApp() {
  const databaseService = new DatabaseService(config.db);
  const eventConsumer = await serviceLocator().eventConsumer();
  try {
    await databaseService.authenticate();
    await eventConsumer.addEventHandler(config.messageBroker.topics.customers, async (event: any) => {
      await customersEventHandler.handleEvent(event);
      events_received_total.inc({ topic: config.messageBroker.topics.customers, event: JSON.stringify(event) });
    });
  } catch (error) {
    logger.error(`Error received while initializing application:  ${JSON.stringify(error)}`);
    await eventConsumer.disconnect();
    exit(1);
  }
}
