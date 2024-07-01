import { config } from '../config';
import { BanksExchangeHandler } from '../rate/services/bank-exchange-handler';
import { EmailService } from '../common/services/email.service';
import logger from '../common/services/logger.service';
import { SubscriptionsService } from '../subscription/services/subscription.service';
import { ExchangerService } from '../rate/services/exchanger.service';
import { Privat24Client } from '../rate/services/exchangers/privat24-client';
import { NBUClient } from '../rate/services/exchangers/nbu-client';
import { MonobankClient } from '../rate/services/exchangers/monobank-client';
import { SubscriptionsRepository } from '../subscription/repositories/subscriprion.repository';

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
