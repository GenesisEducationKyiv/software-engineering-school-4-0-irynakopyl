import { config } from '../../../config';
import * as rateEventHandler from '../../../rate/service/services/events-handler';
import * as subscriptionEventHandler from '../../../subscription/service/services/events-handler';
import logger from '../logger.service';

export async function handleEvent(event: any, topic: string): Promise<void> {
  logger.info(`Received event ${JSON.stringify(event)}`);
  if (!event) {
    logger.error('Empty message from Message Broker');
    return;
  }
  switch (topic) {
    case config.messageBroker.topics.rate:
      await rateEventHandler.handleEvent(event);
      break;
    case config.messageBroker.topics.notification:
      await subscriptionEventHandler.handleEvent(event);
      break;
    default:
      logger.error('Unknown event type');
  }
  return;
}
