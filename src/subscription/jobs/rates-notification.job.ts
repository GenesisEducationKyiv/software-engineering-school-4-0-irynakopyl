import { config } from '../../config';
import { SubscriptionsRepository } from '../data-access/repositories/subscription.repository';
import { ExchangerService } from '../../rate/service/exchanger.service';
import { MonobankClient } from '../../rate/data-access/exchangers/monobank-client';
import { NBUClient } from '../../rate/data-access/exchangers/nbu-client';
import { Privat24Client } from '../../rate/data-access/exchangers/privat24-client';
import logger from '../../common/services/logger.service';
import { SubscriptionsService } from '../service/services/subscription.service';
import { BanksExchangeHandler } from '../../rate/service/bank-exchange-handler';
import { setupEventProducer } from '../../common/services/messaging/event-producer';
import { v4 as uuidv4 } from 'uuid';
import { SystemEventType } from '../../common/models/system-event.model';

export async function sendDailyRateEmail() {
  try {
    const subscriptionService = new SubscriptionsService(new SubscriptionsRepository());
    const monobankHandler = new BanksExchangeHandler(new MonobankClient());
    const nbuHandler = new BanksExchangeHandler(new NBUClient());
    const privat24Handler = new BanksExchangeHandler(new Privat24Client());
    const bankExchangeHandler = monobankHandler.setNext(nbuHandler).setNext(privat24Handler);
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
          eventId: uuidv4(),
          eventType: SystemEventType.CurrencyRateEmail,
          timestamp: new Date(),
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
