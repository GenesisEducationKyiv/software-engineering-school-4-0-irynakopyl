import { EmailService } from '../services/email.service';
import { ExchangerService } from '../services/exchanger.service';
import { SubscriptionsRepository } from '../services/subscription.service';

export async function sendDailyRateEmail() {
  try {
    const subscriptionRepository = new SubscriptionsRepository();
    const emailService = new EmailService();

    console.log(`[${new Date()}] going to send emails to subsribed users`);
    const currentRate = await new ExchangerService().getCurrentRate();
    const subcriptions = await subscriptionRepository.getAll();
    const emailAddresses = subcriptions.map((subscr) => subscr.email);
    for (const emailAddress of emailAddresses) {
      try {
        await emailService.sendCurrencyRateEmail({ to: emailAddress, currencyRate: currentRate });
      } catch (error) {
        console.error('Error sending currency exchange rate: ', error);
      }
    }
  } catch (error) {
    console.error(`Got an error when sending daily rate email notifications`, error);
  }
}
