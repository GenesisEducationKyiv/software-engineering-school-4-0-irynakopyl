import * as sinon from 'sinon';
import { EmailService } from '../../common/services/email.service';
import { CurrencyRateEmailPayload, EmailPayload } from '../../common/models/email-payload';
import { config } from '../../config';
import { KafkaConsumer } from '../../common/services/messaging/event-consumer';

describe('EmailService', () => {
  let emailService: EmailService;
  let emailSenderStub: sinon.SinonStub;

  beforeEach(() => {
    emailService = new EmailService(sinon.createStubInstance(KafkaConsumer));
    emailSenderStub = sinon.stub(emailService, 'sendEmail');
    config.api.emailServer.user = 'user@example.com';
  });

  afterEach(sinon.restore);

  it('should send a currency rate email', async () => {
    const payload: CurrencyRateEmailPayload = {
      currencyRate: 2,
      to: 'test@example.com',
    };
    await emailService.sendCurrencyRateEmail(payload);
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
