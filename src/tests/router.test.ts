import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { exchangerRouter } from '../routers/exchanger.router';
import { ExchangerService } from '../services/exhanger.service';
import sinon from 'sinon';
import { subscriptionRouter } from '../routers/subscription.router';

describe('Currency Exchange Rates app', () => {
  const app = express();
  let exchangerServiceStub = sinon.stub(ExchangerService, 'getCurrentRate');;

  beforeEach(() => {
    app.use('/rate', exchangerRouter);
    app.use('/subscribe', subscriptionRouter);
  });

  it('should respond with a greeting message', async () => {
    exchangerServiceStub.resolves(2);

    const response = await request(app).get('/rate');
    expect(response.status).to.equal(200);
    expect(response.body).equal(2);
  });

  it('should respond with a greeting message', async () => {
    exchangerServiceStub.rejects();

    const response = await request(app).get('/rate');
    expect(response.status).to.equal(400);
  });
});
