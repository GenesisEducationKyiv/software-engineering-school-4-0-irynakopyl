import express from 'express';
import { config } from './config';
import { connectToDatabase } from './data-access/db/models/db';
import { exit } from 'process';
import { DatabaseService } from './service/services/database.service';
import { SchedulerService } from './service/services/scheduler.service';
import * as bodyParser from 'body-parser';
import { subscriptionRouter } from './router/routers/subscription.router';
import { exchangerRouter } from './router/routers/exchanger.router';
import { sendDailyRateEmail } from './service/jobs/rates-notification.job';
import logger from './service/services/logger.service';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/subscribe', subscriptionRouter);
app.use('/rate', exchangerRouter);

export async function initApp() {
  const databaseService = new DatabaseService();
  try {
    await connectToDatabase(config.db);
    await databaseService.authenticate();
    SchedulerService.initializeJob(config.cron.currencyRateEmailSchedule, sendDailyRateEmail);
  } catch (error) {
    logger.error(`Error received while initializing application:  ${JSON.stringify(error)}`);
    await SchedulerService.shutdown();
    exit(1);
  }
}
