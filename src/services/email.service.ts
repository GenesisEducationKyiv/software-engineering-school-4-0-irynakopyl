import nodemailer from 'nodemailer';
import { config } from '../config';

interface EmailPayload {
  from: string;
  to: string;
  message: string;
  subject: string;
}

interface CurrencyRateEmailPayload {
  currencyRate: number;
  to: string;
}

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
    console.log(`Sending currency rate email with payload ${JSON.stringify(emailPayload)}`);
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
