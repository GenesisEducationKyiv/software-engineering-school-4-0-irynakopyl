import request from 'supertest';
import * as sinon from 'sinon';
import { StatusCode } from '../../models/status-codes.model';
import { app } from '../../app';
import axios from 'axios';

describe('Exchanger router', () => {
  let axiosGetStub: sinon.SinonStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(sinon.restore);

  it('should respond with a greeting message', async () => {
    const ratesData = {
      data: [
        { ccy: 'USD', base_ccy: 'UAH', buy: 27.5, sale: 28.1 },
        { ccy: 'EUR', base_ccy: 'UAH', buy: 32.5, sale: 33.2 },
      ],
    };
    axiosGetStub.resolves(ratesData);

    const response = await request(app).get('/rate');
    expect(response.status).toBe(StatusCode.Success);
    expect(response.body).toBe(28.1);
  });

  it('should respond with an invalid status value if no rate value is present', async () => {
    axiosGetStub.resolves();

    const response = await request(app).get('/rate');
    expect(response.status).toBe(StatusCode.InternalError);
  });
});
