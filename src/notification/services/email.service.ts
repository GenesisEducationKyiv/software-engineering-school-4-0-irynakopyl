import nodemailer from 'nodemailer';
import { config } from '../../config';
import { CurrencyRateEmailPayload, EmailPayload } from '../../common/models/email-payload';
import logger from '../../common/services/logger.service';
import { EventConsumer } from '../../common/services/messaging/event-consumer';
import { SystemEvent, SystemEventType } from '../../common/models/system-event.model';
import { RatesRepository } from '../data-access/repositories/rate.repository';
import { Currency } from '../../rate/service/models/currency';
import { SchedulerService } from '../../common/services/scheduler.service';
import { SubscriptionsRepository } from '../../subscription/data-access/repositories/subscription.repository';
import { SubscriptionsService } from '../../subscription/service/services/subscription.service';
import { RateService } from './rate.service';

export async function setupEmailService(messageConsumer: EventConsumer): Promise<EmailService> {
  const emailService = new EmailService(messageConsumer);
  await emailService.start();
  return emailService;
}

export class EmailService {
  private emailSender;

  constructor(private eventConsumer: EventConsumer) {
    this.emailSender = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.api.emailServer.user,
        pass: config.api.emailServer.password,
      },
    });
    SchedulerService.initializeJob(config.cron.currencyRateEmailSchedule, async () => {
      this.sendCurrencyRateEmail();
    });
  }

  async start() {
    await this.eventConsumer.addEventHandler(config.messageBroker.topics.email, (payload) => {
      return this.systemEventHandler(payload);
    });
  }

  public async sendCurrencyRateEmail(): Promise<void> {
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
      const failedToSendEmailErrors: string[] = [];
      while (hasMore) {
        const sendEmailPromises = subcriptions.map((subscription) => {
          return this.sendEmail(this.buildCurrencyRateEmailPayload({ to: subscription.email, currencyRate: currentRate.value }));
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

  public async sendEmail(payload: EmailPayload) {
    return this.emailSender.sendMail(payload);
  }

  private buildCurrencyRateEmailPayload(params: CurrencyRateEmailPayload): EmailPayload {
    return {
      from: config.api.emailServer.user,
      subject: 'Currency Rate USD to UAH',
      message: `${params.currencyRate}`,
      to: params.to,
    };
  }

  private async saveCurrencyData(data: { currencyRate: number }) {
    const rateRepository = new RatesRepository();
    await rateRepository.create(data.currencyRate, Currency.USD);
  }

  private async systemEventHandler(event: any): Promise<void> {
    if (!event?.message?.value) {
      console.error('Empty message from Message Broker');
      return;
    }
    const eventPayload = JSON.parse(event.message.value.toString()) as SystemEvent;
    console.log('Received event:', eventPayload);
    switch (eventPayload.eventType) {
      case SystemEventType.CurrencyRateUpdated:
        await this.saveCurrencyData(eventPayload.data);
        break;
      default:
        console.error('Unknown event type');
    }
    return;
  }
}
