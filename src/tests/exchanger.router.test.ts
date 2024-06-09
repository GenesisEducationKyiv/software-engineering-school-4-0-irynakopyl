import request from 'supertest';
import { ExchangerService } from '../services/exhanger.service';
import * as sinon from 'sinon';
import { StatusCode } from '../models/status-codes.model';
import { app } from '../app';

describe('Exchanger router', () => {
  let exchangerServiceStub: sinon.SinonStub;

  beforeEach(() => {
    exchangerServiceStub = sinon.stub(ExchangerService, 'getCurrentRate');
  });

  afterEach(sinon.restore);

  it('should respond with a greeting message', async () => {
    exchangerServiceStub.resolves(2);

    const response = await request(app).get('/rate');
    expect(response.status).toBe(StatusCode.Success);
    expect(response.body).toBe(2);
  });

  it('should respond with an invalid status value if no rate value is present', async () => {
    exchangerServiceStub.resolves();

    const response = await request(app).get('/rate');
    expect(response.status).toBe(StatusCode.Invalid);
  });
});
