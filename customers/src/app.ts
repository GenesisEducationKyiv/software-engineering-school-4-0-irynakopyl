import express from 'express';
import { config } from './config';
import { exit } from 'process';
import { DatabaseService } from './common/services/database.service';
import * as bodyParser from 'body-parser';
import logger from './common/services/logger.service';
import * as customersEventHandler from './customers/service/services/events-handler';
import { serviceLocator } from './common/service-locator';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export async function initApp() {
  const databaseService = new DatabaseService(config.db);
  const eventConsumer = await serviceLocator().eventConsumer();
  try {
    await databaseService.authenticate();
    await eventConsumer.addEventHandler(config.messageBroker.topics.customers, async (event: any) => {
      await customersEventHandler.handleEvent(event);
    });
  } catch (error) {
    logger.error(`Error received while initializing application:  ${JSON.stringify(error)}`);
    await eventConsumer.disconnect();
    exit(1);
  }
}
