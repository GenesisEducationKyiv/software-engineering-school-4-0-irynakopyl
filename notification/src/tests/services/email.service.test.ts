// import * as sinon from 'sinon';
// import { EmailService } from '../../common/services/email.service';
// import { EmailPayload } from '../../common/models/email-payload';
// import { config } from '../../config';
// import { KafkaConsumer } from '../../common/services/messaging/event-consumer';
// import { RateService } from '../../rate/service/services/rate.service';
// import { SubscriptionsService } from '../../subscription/service/services/subscription.service';

describe.skip('EmailService', () => {
  // let emailService: EmailService;
  // let emailSenderStub: sinon.SinonStub;
  // let rateServiceStub: sinon.SinonStub;
  // let subscriptionServiceStub: sinon.SinonStub;
  // beforeEach(() => {
  //   emailService = new EmailService(sinon.createStubInstance(KafkaConsumer));
  //   rateServiceStub = sinon.stub(RateService.prototype, 'getLatest');
  //   emailSenderStub = sinon.stub(emailService, 'sendEmail');
  //   subscriptionServiceStub = sinon.stub(SubscriptionsService.prototype, 'getAll');
  //   rateServiceStub.resolves({ value: 2 });
  //   subscriptionServiceStub.resolves([{ email: 'test@example.com' }]);
  //   config.api.emailServer.user = 'user@example.com';
  // });
  // afterEach(sinon.restore);
  // it('should send a currency rate email', async () => {
  //   await emailService.sendCurrencyRateEmail();
  //   expect(emailSenderStub.calledOnce).toBe(true);
  //   expect(emailSenderStub.firstCall.args[0]).toEqual({
  //     from: 'user@example.com',
  //     subject: 'Currency Rate USD to UAH',
  //     message: '2',
  //     to: 'test@example.com',
  //   });
  // });
  // it('should send an email with the provided payload', async () => {
  //   const payload: EmailPayload = {
  //     from: 'sender@example.com',
  //     to: 'recipient@example.com',
  //     subject: 'Test Subject',
  //     message: 'Test Message',
  //   };
  //   await emailService.sendEmail(payload);
  //   expect(emailSenderStub.calledOnce).toBe(true);
  //   expect(emailSenderStub.firstCall.args[0]).toEqual(payload);
  // });
});
