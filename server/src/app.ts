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
import promBundle from 'express-prom-bundle';

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: 'rate_app_server', project_type: 'metrics_labels' },
  promClient: {
    collectDefaultMetrics: {},
  },
});
export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(metricsMiddleware);

app.use('/subscribe', subscriptionRouter);
app.use('/rate', exchangerRouter);

export async function initApp() {
  const databaseService = new DatabaseService(config.db);
  const eventConsumer = await serviceLocator().eventConsumer();
  try {
    await setupRateFetcher();
    await databaseService.authenticate();
    await eventConsumer.addEventHandler(config.messageBroker.topics.subscriptionTransaction, async (event: any) => {
      await subscriptionEventHandler.handleEvent(event);
    });
  } catch (error) {
    logger.error(`Error received while initializing application: ${JSON.stringify(error)}`);
    await SchedulerService.shutdown();
    exit(1);
  }
}
