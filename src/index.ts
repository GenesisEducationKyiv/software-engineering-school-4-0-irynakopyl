import express from 'express';
import { config } from './config';
import { connectToDatabase } from './db/models/db';
import { exit } from 'process';
import { DatabaseService } from './services/database.service';
import { body, param } from 'express-validator';
import { SubscriptionsService } from './services/subscription.service';
import { ExchangerService } from './services/exhanger.service';
import { SchedulerService } from './services/scheduler.service';
import * as bodyParser from 'body-parser';
import { subscriptionRouter } from './routers/subscription.router';
import { exchangerRouter } from './routers/exchanger.router';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/subscribe', subscriptionRouter);
app.use('/rate', exchangerRouter);

app.listen(port, async () => {
  await createApp();
  console.log(`Running on port ${port}`);
});

export async function createApp() {
  const databaseService = new DatabaseService();
  try {
    connectToDatabase(config.db);
    databaseService.authenticate();
    SchedulerService.init();
  } catch (error) {
    console.log('Error received while connecting to DB or Scheduling emails: ', error);
    await SchedulerService.shutdown();
    exit(1);
  }
}
