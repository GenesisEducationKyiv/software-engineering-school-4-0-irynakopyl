import express from 'express';
import { config } from './config';
import { exit } from 'process';
import { DatabaseService } from './common/services/database.service';
import { SchedulerService } from './common/services/scheduler.service';
import * as bodyParser from 'body-parser';
import logger from './common/services/logger.service';

import { sendCurrencyRateEmail } from './common/send-rate-email.job';
import { serviceLocator } from './common/service-locator';
import * as eventHandler from './common/services/messaging/event-handler';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export async function initApp() {
  const databaseService = new DatabaseService(config.db);
  const eventConsumer = await serviceLocator().eventConsumer();
  try {
    await databaseService.authenticate();
    await eventConsumer.subscribe([config.messageBroker.topics.rate, config.messageBroker.topics.notification]);
    await eventConsumer.addEventHandler(async (event: any, topic: string) => {
      await eventHandler.handleEvent(event, topic);
    });
    SchedulerService.initializeJob(config.cron.currencyRateEmailSchedule, async () => {
      await sendCurrencyRateEmail();
    });
  } catch (error) {
    logger.error(`Error received while initializing application:  ${JSON.stringify(error)}`);
    await SchedulerService.shutdown();
    await eventConsumer.disconnect();
    exit(1);
  }
}
