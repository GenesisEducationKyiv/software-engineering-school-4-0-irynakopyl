import express from 'express';
import { config } from './config';
import { exit } from 'process';
import { DatabaseService } from './common/services/database.service';
import { SchedulerService } from './common/services/scheduler.service';
import * as bodyParser from 'body-parser';
import logger from './common/services/logger.service';
import * as rateEventHandler from './rate/service/services/events-handler';
import * as subscriptionEventHandler from './subscription/service/services/events-handler';
import { sendCurrencyRateEmail } from './common/send-rate-email.job';
import { serviceLocator } from './common/service-locator';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export async function initApp() {
  const databaseService = new DatabaseService(config.db);
  const eventConsumer = await serviceLocator().eventConsumer();
  try {
    await databaseService.authenticate();
    await eventConsumer.addEventHandler(config.messageBroker.topics.rate, async (event) => {
      await rateEventHandler.handleEvent(event);
    });
    await eventConsumer.addEventHandler(config.messageBroker.topics.subscription, async (event) => {
      await subscriptionEventHandler.handleEvent(event);
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
