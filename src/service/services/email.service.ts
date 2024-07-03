import nodemailer from 'nodemailer';
import { config } from '../../config';
import { CurrencyRateEmailPayload, EmailPayload } from '../models/email-payload';
import logger from './logger.service';

export class EmailService {
  private emailSender;

  constructor() {
    this.emailSender = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.api.emailServer.user,
        pass: config.api.emailServer.password,
      },
    });
  }

  public async sendCurrencyRateEmail(params: CurrencyRateEmailPayload): Promise<void> {
    const emailPayload = this.buildCurrencyRateEmailPayload(params);
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
}
