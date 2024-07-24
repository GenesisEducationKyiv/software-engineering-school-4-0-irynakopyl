import nodemailer from 'nodemailer';
import { config } from '../../config';
import { CurrencyRateEmailPayload, EmailPayload } from '../models/email-payload';
import logger from './logger.service';

export class EmailService {
  private emailSender;

  constructor() {
    this.emailSender = nodemailer.createTransport({
      host: config.api.emailServer.host,
      auth: {
        user: config.api.emailServer.user,
        pass: config.api.emailServer.password,
      },
    });
  }

  public async sendEmail(payload: EmailPayload) {
    return this.emailSender.sendMail(payload);
  }

  public async sendCurrencyRateEmail(params: CurrencyRateEmailPayload): Promise<void> {
    logger.debug(`Sending currency rate email with params ${JSON.stringify(params)}`);
    const payload = this.buildCurrencyRateEmailPayload(params);
    await this.sendEmail(payload);
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
