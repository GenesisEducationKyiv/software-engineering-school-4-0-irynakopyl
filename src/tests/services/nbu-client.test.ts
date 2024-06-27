import axios, { AxiosInstance } from 'axios';
import sinon from 'sinon';
import { NBUClient } from '../../data-access/exchangers/nbu-client';

describe('NBUClient', () => {
  let axiosCreateStub: sinon.SinonStub;
  let axiosInstance: { get: sinon.SinonStub };
  beforeEach(() => {
    axiosInstance = { get: sinon.stub() };
    axiosCreateStub = sinon.stub(axios, 'create').returns(axiosInstance as unknown as AxiosInstance);
  });

  afterEach(() => sinon.restore());

  it('should fetch currency rates successfully', async () => {
    const response = {
      data: [{ cc: 'USD', rate: 28.1 }],
    };
    axiosInstance.get.resolves(response);
    const rates = await new NBUClient().getCurrencyRate();

    expect(axiosInstance.get.calledOnce).toBe(true);
    expect(axiosCreateStub.calledOnce).toBe(true);
    expect(rates).toBe(28.1);
  });

  it('should throw an error if currency rates API is unavailable', async () => {
    axiosInstance.get.resolves();
    await expect(new NBUClient().getCurrencyRate()).rejects.toThrow('NBU currency rates API is unavailable');
  });

  it('should throw an error if currency rates API does not provide info about currency', async () => {
    const response = {
      data: [{ cc: 'EUR', rate: 28.1 }],
    };
    axiosInstance.get.resolves(response);
    await expect(new NBUClient().getCurrencyRate()).rejects.toThrow('NBU currency rates API does not provide USD rate');
  });
});
