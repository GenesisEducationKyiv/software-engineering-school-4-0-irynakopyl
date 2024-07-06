import nodemailer from 'nodemailer';
import { config } from '../../config';
import { CurrencyRateEmailPayload, EmailPayload } from '../models/email-payload';
import logger from './logger.service';
import { EventConsumer } from './messaging/event-consumer';
import { SystemEvent, SystemEventType } from '../models/system-event.model';

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
  }

  async start() {
    await this.eventConsumer.addEventHandler(config.messageBroker.topics.email, (payload) => {
      return this.systemEventHandler(payload);
    });
  }

  public async sendCurrencyRateEmail(data: CurrencyRateEmailPayload): Promise<void> {
    const emailPayload = this.buildCurrencyRateEmailPayload(data);
    logger.info(`Sending currency rate email with payload ${JSON.stringify(emailPayload)}`);
    await this.sendEmail(emailPayload);
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

  private async systemEventHandler(event: any): Promise<void> {
    if (!event?.message?.value) {
      console.error('Empty message from Message Broker');
      return;
    }
    const eventPayload = JSON.parse(event.message.value.toString()) as SystemEvent;
    console.log('Received event:', eventPayload);
    switch (eventPayload.eventType) {
      case SystemEventType.CurrencyRateEmail:
        await this.sendCurrencyRateEmail(eventPayload.data as CurrencyRateEmailPayload);
        break;
      default:
        console.error('Unknown event type');
    }
    return;
  }
}
