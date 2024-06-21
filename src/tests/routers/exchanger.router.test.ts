import request from 'supertest';
import * as sinon from 'sinon';
import { StatusCode } from '../../models/status-codes.model';
import { app } from '../../app';
import axios, { AxiosInstance } from 'axios';

describe('Exchanger router', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let axiosCreateStub: sinon.SinonStub;
  let axiosInstance: { get: sinon.SinonStub };

  beforeEach(() => {
    axiosInstance = { get: sinon.stub() };
    axiosCreateStub = sinon.stub(axios, 'create').returns(axiosInstance as unknown as AxiosInstance);
  });

  afterEach(sinon.restore);

  it('should respond with a rate value', async () => {
    const ratesData = {
      data: [
        { ccy: 'USD', base_ccy: 'UAH', buy: 27.5, sale: 28.1 },
        { ccy: 'EUR', base_ccy: 'UAH', buy: 32.5, sale: 33.2 },
      ],
    };
    axiosInstance.get.resolves(ratesData);

    const response = await request(app).get('/rate');
    expect(response.status).toBe(StatusCode.Success);
    expect(response.body).toBe(28.1);
  });

  it('should respond with an invalid status value if no rate value is present', async () => {
    axiosInstance.get.resolves();

    const response = await request(app).get('/rate');

    expect(response.status).toBe(StatusCode.InternalError);
  });
});
