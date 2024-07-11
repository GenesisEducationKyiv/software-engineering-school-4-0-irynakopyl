import { config } from '../../config';
import { ExchangerService } from '../../rate/service/exchanger.service';
import logger from '../../common/services/logger.service';
import { setupEventProducer } from '../../common/services/messaging/event-producer';
import { SystemEventType } from '../../common/models/system-event.model';
import { serviceLocator } from '../../common/service-locator';

export async function sendDailyRateEmail() {
  try {
    const subscriptionService = serviceLocator().subscriptionService();
    const bankExchangeHandler = serviceLocator().banksExchangeHandler();
    const requestsLimit = config.api.emailServer.rateLimit;
    const messageProducer = await setupEventProducer();

    logger.info(`[Scheduled job] [${new Date()}] going to send emails to subsribed users`);
    const currentRate = await new ExchangerService(bankExchangeHandler).getCurrentRate();
    let subcriptions = await subscriptionService.getAll({ limit: requestsLimit });
    let hasMore = !!subcriptions.length;
    const failedToSendEmailErrors: string[] = [];
    while (hasMore) {
      const sendEmailPromises = subcriptions.map((subscription) => {
        return messageProducer.sendEvent(config.messageBroker.topics.email, {
          eventType: SystemEventType.CurrencyRateEmail,
          data: { to: subscription.email, currencyRate: currentRate },
        });
      });
      const results = await Promise.allSettled(sendEmailPromises);
      const failedRequests = results.filter((result) => {
        return result.status === 'rejected';
      });
      failedRequests.forEach((result) => {
        const error = ((result as PromiseRejectedResult) || undefined)?.reason;
        failedToSendEmailErrors.push(`Error while trying to send email message: ${error?.message}. Details: ${JSON.stringify(error)}`);
      });

      const createdAfter = subcriptions[subcriptions.length - 1].createdAt;
      subcriptions = await subscriptionService.getAll({ limit: requestsLimit, createdAfter });
      hasMore = !!subcriptions.length;
    }

    if (failedToSendEmailErrors.length) {
      logger.error(`Errors sending currency exchange rate: ${JSON.stringify(failedToSendEmailErrors)}`);
    }
  } catch (error) {
    logger.error(`Got an error when sending daily rate email notifications ${JSON.stringify(error)}`);
  }
}
