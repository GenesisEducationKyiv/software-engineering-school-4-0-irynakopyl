import { Currency } from '../models/currency';
import { EmailService } from '../services/email.service';
import { Privat24Client } from '../services/exchangers/privat24-client';
import { ExchangerService } from '../services/exchanger.service';
import { SubscriptionsService } from '../services/subscription.service';

export async function sendDailyRateEmail() {
  try {
    const subscriptionService = new SubscriptionsService();
    const emailService = new EmailService();

    console.log(`[${new Date()}] going to send emails to subsribed users`);
    const currentRate = await new ExchangerService(new Privat24Client()).getCurrentRate(Currency.USD);
    const subcriptions = await subscriptionService.getAll();
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
