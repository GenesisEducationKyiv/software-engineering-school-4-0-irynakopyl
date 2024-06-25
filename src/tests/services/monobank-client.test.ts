import axios, { AxiosInstance } from 'axios';
import { MonobankClient } from '../../services/exchangers/monobank-client';
import sinon from 'sinon';
import { ISO4217CurrencyCodes } from '../../models/currency';

describe('MonobankClient', () => {
  let axiosCreateStub: sinon.SinonStub;
  let axiosInstance: { get: sinon.SinonStub };
  beforeEach(() => {
    axiosInstance = { get: sinon.stub() };
    axiosCreateStub = sinon.stub(axios, 'create').returns(axiosInstance as unknown as AxiosInstance);
  });

  afterEach(() => sinon.restore());

  it('should fetch currency rates successfully', async () => {
    const response = {
      data: [{ currencyCodeA: ISO4217CurrencyCodes.USD, currencyCodeB: ISO4217CurrencyCodes.UAH, rateSell: 28.1 }],
    };
    axiosInstance.get.resolves(response);
    const rates = await new MonobankClient().getCurrencyRate();

    expect(axiosInstance.get.calledOnce).toBe(true);
    expect(axiosCreateStub.calledOnce).toBe(true);
    expect(rates).toBe(28.1);
  });

  it('should throw an error if currency rates API is unavailable', async () => {
    axiosInstance.get.resolves();
    await expect(new MonobankClient().getCurrencyRate()).rejects.toThrow('Monobank currency rates API is unavailable');
  });

  it('should throw an error if currency rates API does not provide info about currency', async () => {
    const response = {
      data: [{ currencyCodeA: ISO4217CurrencyCodes.USD, currencyCodeB: 5555, rateSell: 28.1 }],
    };
    axiosInstance.get.resolves(response);
    await expect(new MonobankClient().getCurrencyRate()).rejects.toThrow('Monobank currency rates API does not provide USD rate');
  });
});
