import request from 'supertest';
import * as sinon from 'sinon';
import { StatusCode } from '../../models/status-codes.model';
import { Privat24Client } from '../../services/exchangers/privat24-client';
import { app } from '../../app';

describe('Exchanger router', () => {
  let privat24ClientStub: sinon.SinonStub;
  beforeEach(() => {
    privat24ClientStub = sinon.stub(Privat24Client.prototype, 'getCurrencyRate');
  });

  afterEach(sinon.restore);

  it('should respond with a rate value', async () => {
    privat24ClientStub.resolves(28.1);

    const response = await request(app).get('/rate');
    expect(response.status).toBe(StatusCode.Success);
    expect(response.body).toEqual(28.1);
  });

  it('should respond with an invalid status value if no rate value is present', async () => {
    privat24ClientStub.rejects();

    const response = await request(app).get('/rate');

    expect(response.status).toBe(StatusCode.InternalError);
  });
});
