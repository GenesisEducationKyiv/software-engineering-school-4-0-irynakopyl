import express from 'express';
import { config } from './config';
import { connectToDatabase } from './common/db/models/db';
import { exit } from 'process';
import { DatabaseService } from './common/services/database.service';
import { SchedulerService } from './common/services/scheduler.service';
import * as bodyParser from 'body-parser';
import logger from './common/services/logger.service';
import { setupEventConsumer } from './common/services/messaging/event-consumer';
import * as rateEventHandler from './rate/service/services/events-handler';
import * as subscriptionEventHandler from './subscription/service/services/events-handler';
import { sendCurrencyRateEmail } from './common/send-rate-email.job';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export async function initApp() {
  const databaseService = new DatabaseService();
  const eventConsumer = await setupEventConsumer();
  try {
    await eventConsumer.addEventHandler(config.messageBroker.topics.rate, async (event) => {
      await rateEventHandler.handleEvent(event);
    });
    await eventConsumer.addEventHandler(config.messageBroker.topics.subscription, async (event) => {
      await subscriptionEventHandler.handleEvent(event);
    });
    SchedulerService.initializeJob(config.cron.currencyRateEmailSchedule, async () => {
      await sendCurrencyRateEmail();
    });
    await connectToDatabase(config.db);
    await databaseService.authenticate();
  } catch (error) {
    logger.error(`Error received while initializing application:  ${JSON.stringify(error)}`);
    await SchedulerService.shutdown();
    await eventConsumer.disconnect();
    exit(1);
  }
}
