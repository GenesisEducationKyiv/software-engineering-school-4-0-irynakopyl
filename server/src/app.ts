import express from 'express';
import { config } from './config';
import { exit } from 'process';
import { DatabaseService } from './common/services/database.service';
import { SchedulerService } from './common/services/scheduler.service';
import * as bodyParser from 'body-parser';
import { subscriptionRouter } from './subscription/presentation/routers/subscription.router';
import { exchangerRouter } from './rate/presentation/routers/exchanger.router';
import logger from './common/services/logger.service';
import { setupRateFetcher } from './rate/presentation/functions/rate-fetcher';
import { serviceLocator } from './common/service-locator';
import * as subscriptionEventHandler from './subscription/service/subscription-event.handler';
import http_request_total from './common/metrics/http-total-requests';
import metricsRegister from './common/metrics/registry';
import events_sent_total from './common/metrics/events-sent';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (req.path != '/metrics') {
    http_request_total.inc({ path: req.url, method: req.method });
  }
  next();
});

app.use('/subscribe', subscriptionRouter);
app.use('/rate', exchangerRouter);

app.get('/metrics', async (req, res, next) => {
  res.setHeader('Content-type', metricsRegister.contentType);
  res.send(await metricsRegister.metrics());
  next();
});

export async function initApp() {
  const databaseService = new DatabaseService(config.db);
  const eventConsumer = await serviceLocator().eventConsumer();
  try {
    await setupRateFetcher();
    await databaseService.authenticate();
    await eventConsumer.addEventHandler(config.messageBroker.topics.subscriptionTransaction, async (event: any) => {
      events_sent_total.inc({ topic: config.messageBroker.topics.subscriptionTransaction, event: JSON.stringify(event) });

      await subscriptionEventHandler.handleEvent(event);
    });
  } catch (error) {
    logger.error(`Error received while initializing application: ${JSON.stringify(error)}`);
    await SchedulerService.shutdown();
    exit(1);
  }
}
