import scheduler from 'node-schedule';
import nodemailer from 'nodemailer';
import { SubscriptionsService } from './subscription.service';
import { config } from '../config';
import { ExchangerService } from './exhanger.service';

export class SchedulerService {
  public static init(): void {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.api.emailServer.user,
        pass: config.api.emailServer.password,
      },
    });
    let emailOptions: { from: string; to?: string; subject: string; message?: string } = {
      from: config.api.emailServer.user,
      subject: 'Currency Rate USD to UAH',
    };
    const subscriptionService = new SubscriptionsService();
    scheduler.scheduleJob('0 0 * * *', async () => {
    console.log(`${new Date()} going to send emails to subsribed user`);
      const subcriptions = await subscriptionService.getAll();
      const currentRate = await ExchangerService.getCurrentRate();
      const emailAddresses = subcriptions.map((subscr) => subscr.email);
      for (const emailAddress of emailAddresses) {
        emailOptions = { ...emailOptions, to: emailAddress, message: `${currentRate}` };
        try {
          await transporter.sendMail(emailOptions);
        } catch (error) {
          console.log('Error sending currency exchange rate: ', error);
        }
      }
    });
  }

  public static async shutdown(): Promise<void> {
    await scheduler.gracefulShutdown();
  }
}
