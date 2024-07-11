import { config } from '../config';
import { RatesRepository } from '../rate/data-access/repositories/rate.repository';
import { Currency } from '../rate/service/models/currency';
import { RateService } from '../rate/service/services/rate.service';
import { SubscriptionsRepository } from '../subscription/data-access/repositories/subscription.repository';
import { SubscriptionsService } from '../subscription/service/services/subscription.service';
import { EmailService } from './services/email.service';
import logger from './services/logger.service';

export async function sendCurrencyRateEmail(): Promise<void> {
  try {
    const rateRepository = new RateService(new RatesRepository());
    const currentRate = await rateRepository.getLatest(Currency.USD);
    if (!currentRate) {
      logger.error('No currency rate data found');
      throw new Error('No currency rate data found');
    }
    const subscriptionService = new SubscriptionsService(new SubscriptionsRepository());
    const requestsLimit = config.api.emailServer.rateLimit;

    logger.info(`[Scheduled job] [${new Date()}] going to send emails to subsribed users`);
    let subcriptions = await subscriptionService.getAll({ limit: requestsLimit });
    let hasMore = !!subcriptions.length;
    const emailService = new EmailService();
    const failedToSendEmailErrors: string[] = [];
    while (hasMore) {
      const sendEmailPromises = subcriptions.map((subscription) => {
        return emailService.sendCurrencyRateEmail({ to: subscription.email, currencyRate: currentRate.value });
      });
      const results = await Promise.allSettled(sendEmailPromises);
      const failedRequests = results.filter((result) => {
        return result.status === 'rejected';
      });
      failedRequests.forEach((result) => {
        const error = ((result as PromiseRejectedResult) || undefined)?.reason;
        failedToSendEmailErrors.push(`Error while sending email: ${error?.message}. Details: ${JSON.stringify(error)}`);
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
