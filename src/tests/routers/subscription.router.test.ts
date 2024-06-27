import request from 'supertest';
import * as sinon from 'sinon';
import Subscription from '../../data-access/db/models/subscription.model';
import { StatusCode } from '../../router/models/status-codes.model';
import { app } from '../../app';

describe('Subscription router', () => {
  const userEmail = 'existing@user.com';
  let subscriptionFindStub: sinon.SinonStub;
  let subscriptionCreateStub: sinon.SinonStub;

  beforeEach(() => {
    subscriptionFindStub = sinon.stub(Subscription, 'findOne');
    subscriptionCreateStub = sinon.stub(Subscription, 'create');
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
  });

  it('should fail to process the request with invalid email', async () => {
    const response = await request(app).post('/subscribe').send({ email: 'blah-blah-blah' });
    expect(response.status).toBe(StatusCode.BadRequest);
  });
});
