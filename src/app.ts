import express from 'express';
import { config } from './config';
import { connectToDatabase } from './db/models/db';
import { exit } from 'process';
import { DatabaseService } from './services/database.service';
import { SchedulerService } from './services/scheduler.service';
import * as bodyParser from 'body-parser';
import { subscriptionRouter } from './routers/subscription.router';
import { exchangerRouter } from './routers/exchanger.router';
import { sendDailyRateEmail } from './jobs/rates-notification.job';

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
    SchedulerService.initializeJob('* * * * *', sendDailyRateEmail);
  } catch (error) {
    console.log('Error received while connecting to DB or Scheduling emails: ', error);
    await SchedulerService.shutdown();
    exit(1);
  }
}
