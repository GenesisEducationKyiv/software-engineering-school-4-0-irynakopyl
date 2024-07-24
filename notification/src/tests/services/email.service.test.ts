import * as sinon from 'sinon';
import { EmailService } from '../../common/services/email.service';
import { EmailPayload } from '../../common/models/email-payload';
import { config } from '../../config';

describe('EmailService', () => {
  let emailService: EmailService;
  let emailSenderStub: sinon.SinonStub;
  beforeEach(() => {
    emailService = new EmailService();
    emailSenderStub = sinon.stub(emailService, 'sendEmail');
    config.api.emailServer.user = 'user@example.com';
  });
  afterEach(sinon.restore);
  it('should send a currency rate email', async () => {
    await emailService.sendCurrencyRateEmail({ to: 'test@example.com', currencyRate: 2 });
    expect(emailSenderStub.calledOnce).toBe(true);
    expect(emailSenderStub.firstCall.args[0]).toEqual({
      from: 'user@example.com',
      subject: 'Currency Rate USD to UAH',
      message: '2',
      to: 'test@example.com',
    });
  });
  it('should send an email with the provided payload', async () => {
    const payload: EmailPayload = {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };
    await emailService.sendEmail(payload);
    expect(emailSenderStub.calledOnce).toBe(true);
    expect(emailSenderStub.firstCall.args[0]).toEqual(payload);
  });
});
