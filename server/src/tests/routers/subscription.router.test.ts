import request from 'supertest';
import * as sinon from 'sinon';
import Subscription from '../../common/db/models/subscription.model';
import { StatusCode } from '../../common/models/status-codes.model';
import { app } from '../../app';
import { KafkaProducer } from '../../common/services/messaging/event-producer';
import * as kafkaService from '../../common/services/messaging/kafka.service';
import { Kafka } from 'kafkajs';

describe('Subscription router', () => {
  const userEmail = 'existing@user.com';
  let subscriptionFindStub: sinon.SinonStub;
  let subscriptionCreateStub: sinon.SinonStub;
  let eventProducerSendStub: sinon.SinonStub;
  let eventProducerConnectStub: sinon.SinonStub;

  let subscriptionUpdateStub: sinon.SinonStub;
  let kafkaStub;
  let kafkaStubbed: sinon.SinonStubbedInstance<Kafka>;

  beforeEach(() => {
    subscriptionFindStub = sinon.stub(Subscription, 'findOne');
    subscriptionCreateStub = sinon.stub(Subscription, 'create');
    subscriptionUpdateStub = sinon.stub(Subscription, 'update');
    eventProducerSendStub = sinon.stub(KafkaProducer.prototype, 'sendEvent');
    eventProducerConnectStub = sinon.stub(KafkaProducer.prototype, 'connect');

    kafkaStub = sinon.stub(kafkaService, 'bootstrapKafka');
    kafkaStubbed = sinon.createStubInstance(Kafka);
    kafkaStub.resolves(kafkaStubbed);

    eventProducerSendStub.resolves();
  });

  afterEach(sinon.restore);

  it('should notify that email is already subscribed', async () => {
    subscriptionFindStub.resolves({ email: userEmail } as Subscription);

    const response = await request(app).post('/subscribe').send({ email: userEmail });
    expect(response.status).toBe(StatusCode.ExistingValue);
  });

  it('should successfully add email to the subscription list', async () => {
    subscriptionFindStub.resolves();
    subscriptionCreateStub.resolves();

    const response = await request(app).post('/subscribe').send({ email: userEmail });
    expect(response.status).toBe(StatusCode.Success);
    expect(eventProducerSendStub.called).toBe(true);
    expect(eventProducerConnectStub.called).toBe(true);
  });

  it('should fail to process the request with invalid email', async () => {
    const response = await request(app).post('/subscribe').send({ email: 'blah-blah-blah' });
    expect(response.status).toBe(StatusCode.BadRequest);
  });

  it('should delete the email from the subscription list', async () => {
    subscriptionFindStub.resolves({ email: userEmail } as Subscription);

    const response = await request(app).delete(`/subscribe/${userEmail}`).send();

    expect(response.status).toBe(StatusCode.Success);
    expect(eventProducerSendStub.calledOnce).toBe(true);
    expect(eventProducerConnectStub.calledOnce).toBe(true);
    expect(subscriptionUpdateStub.calledOnce).toBe(true);
  });

  it('should send notification if the email is not found in the system', async () => {
    subscriptionFindStub.resolves();

    const response = await request(app).delete(`/subscribe/${userEmail}`).send();

    expect(response.status).toBe(StatusCode.BadRequest);
  });
});
