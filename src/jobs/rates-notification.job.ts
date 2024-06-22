import { SubscriptionsRepository } from '../repositories/subscriprion.repository';
import { EmailService } from '../services/email.service';
import { ExchangerService } from '../services/exchanger.service';
import logger from '../services/logger.service';
import { SubscriptionsService } from '../services/subscription.service';
import ukrainianBankExchangeHandler from '../services/bank-exchange-handler';

export async function sendDailyRateEmail() {
  try {
    const subscriptionService = new SubscriptionsService(new SubscriptionsRepository());
    const emailService = new EmailService();

    logger.info(`[Scheduled job] [${new Date()}] going to send emails to subsribed users`);
    const currentRate = await new ExchangerService(ukrainianBankExchangeHandler).getCurrentRate();
    const subcriptions = await subscriptionService.getAll();
    const emailAddresses = subcriptions.map((subscr) => subscr.email);
    for (const emailAddress of emailAddresses) {
      try {
        await emailService.sendCurrencyRateEmail({ to: emailAddress, currencyRate: currentRate });
      } catch (error) {
        logger.error(`Error sending currency exchange rate: ${JSON.stringify(error)}`);
      }
    }
  } catch (error) {
    logger.error(`Got an error when sending daily rate email notifications ${JSON.stringify(error)}`);
  }
}
