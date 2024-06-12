import { EmailService } from '../services/email.service';
import { ExchangerService } from '../services/exhanger.service';
import { SubscriptionsService } from '../services/subscription.service';

export async function sendDailyRateEmail() {
  try {
    const subscriptionService = new SubscriptionsService();
    const emailService = new EmailService();

    console.log(`[${new Date()}] going to send emails to subsribed users`);
    const currentRate = await ExchangerService.getCurrentRate();
    const subcriptions = await subscriptionService.getAll();
    const emailAddresses = subcriptions.map((subscr) => subscr.email);
    for (const emailAddress of emailAddresses) {
      try {
        await emailService.sendCurrencyRateEmail({ to: emailAddress, currencyRate: currentRate });
      } catch (error) {
        console.log('Error sending currency exchange rate: ', error);
      }
    }
  } catch (error) {
    console.log(`Got an error when sending daily rate email notifications`, error);
  }
}
