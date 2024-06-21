import axios, { AxiosInstance } from 'axios';
import { Privat24Client } from '../../services/exchangers/privat24-client';
import sinon from 'sinon';

describe('Privat24Client', () => {
  let axiosCreateStub: sinon.SinonStub;
  let axiosInstance: { get: sinon.SinonStub };
  beforeEach(() => {
    axiosInstance = { get: sinon.stub() };
    axiosCreateStub = sinon.stub(axios, 'create').returns(axiosInstance as unknown as AxiosInstance);
  });

  afterEach(() => sinon.restore());

  it('should fetch currency rates successfully', async () => {
    const response = {
      data: [
        { ccy: 'USD', buy: 27.5, sale: 28.1 },
        { ccy: 'EUR', buy: 32.5, sale: 33.2 },
      ],
    };
    axiosInstance.get.resolves(response);
    const rates = await new Privat24Client().getCurrencyRates();

    expect(axiosInstance.get.calledOnce).toBe(true);
    expect(axiosCreateStub.calledOnce).toBe(true);
    expect(rates).toBe(response.data);
  });

  it('should throw an error if currency rates API is unavailable', async () => {
    axiosInstance.get.resolves();
    await expect(new Privat24Client().getCurrencyRates()).rejects.toThrow('Currency rates API is unavailable');
  });
});
