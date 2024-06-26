import { config } from '../../config';
import { SubscriptionsRepository } from '../../data-access/repositories/subscriprion.repository';
import { BanksExchangeHandler } from '../services/bank-exchange-handler';
import { EmailService } from '../services/email.service';
import { ExchangerService } from '../services/exchanger.service';
import { MonobankClient } from '../../data-access/exchangers/monobank-client';
import { NBUClient } from '../../data-access/exchangers/nbu-client';
import { Privat24Client } from '../../data-access/exchangers/privat24-client';
import logger from '../services/logger.service';
import { SubscriptionsService } from '../services/subscription.service';

export async function sendDailyRateEmail() {
  try {
    const subscriptionService = new SubscriptionsService(new SubscriptionsRepository());
    const emailService = new EmailService();
    const monobankHandler = new BanksExchangeHandler(new MonobankClient());
    const nbuHandler = new BanksExchangeHandler(new NBUClient());
    const privat24Handler = new BanksExchangeHandler(new Privat24Client());
    const bankExchangeHandler = monobankHandler.setNext(nbuHandler).setNext(privat24Handler);
    const requestsLimit = config.api.emailServer.rateLimit;

    logger.info(`[Scheduled job] [${new Date()}] going to send emails to subsribed users`);
    const currentRate = await new ExchangerService(bankExchangeHandler).getCurrentRate();
    let subcriptions = await subscriptionService.getAll({ limit: requestsLimit });
    let hasMore = !!subcriptions.length;
    const failedToSendEmailErrors: string[] = [];
    while (hasMore) {
      const sendEmailPromises = subcriptions.map((subscription) => {
        return emailService.sendCurrencyRateEmail({ to: subscription.email, currencyRate: currentRate });
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
