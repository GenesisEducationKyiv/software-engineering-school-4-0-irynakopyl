import request from 'supertest';
import { SubscriptionsService } from '../../services/subscription.service';
import * as sinon from 'sinon';
import Subscription from '../../db/models/subscription.model';
import { StatusCode } from '../../models/status-codes.model';
import { app } from '../../app';

describe('Subscription router', () => {
  const userEmail = 'existing@user.com';
  let subscriptionsServiceFindByEmailStub: sinon.SinonStub;
  let subscriptionsServiceCreateStub: sinon.SinonStub;

  beforeEach(() => {
    subscriptionsServiceFindByEmailStub = sinon.stub(SubscriptionsService.prototype, 'findByEmail');
    subscriptionsServiceCreateStub = sinon.stub(SubscriptionsService.prototype, 'create');
  });

  afterEach(sinon.restore);

  it('should notify that email is already subscribed', async () => {
    subscriptionsServiceFindByEmailStub.resolves({ email: userEmail } as Subscription);

    const response = await request(app).post('/subscribe').send({ email: userEmail });
    expect(response.status).toBe(StatusCode.ExistingValue);
  });

  it('should successfully add email to the subscription list', async () => {
    subscriptionsServiceFindByEmailStub.resolves();
    subscriptionsServiceCreateStub.resolves();

    const response = await request(app).post('/subscribe').send({ email: userEmail });
    expect(response.status).toBe(StatusCode.Success);
  });

  it('should fail to process the request with invalid email', async () => {
    const response = await request(app).post('/subscribe').send({ email: 'blah-blah-blah' });
    expect(response.status).toBe(StatusCode.BadRequest);
  });
});
