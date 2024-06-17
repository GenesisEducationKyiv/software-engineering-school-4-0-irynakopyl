import axios from 'axios';
import { ExchangerService } from '../../services/exhanger.service';
import sinon from 'sinon';

describe('ExchangerService', () => {
  let axiosGetStub: sinon.SinonStub;
  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(() => sinon.restore());

  it('should return the current USD rate', async () => {
    const response = {
      data: [
        { ccy: 'USD', base_ccy: 'UAH', buy: 27.5, sale: 28.1 },
        { ccy: 'EUR', base_ccy: 'UAH', buy: 32.5, sale: 33.2 },
      ],
    };
    axiosGetStub.resolves(response);

    const usdRate = await ExchangerService.getCurrentRate();

    expect(axiosGetStub.calledOnce).toBe(true);
    expect(usdRate).toBe(28.1);
  });

  it('should throw an error if currency rates API is unavailable', async () => {
    axiosGetStub.resolves();

    await expect(ExchangerService.getCurrentRate()).rejects.toThrow('Currency rates API is unavailable');
    expect(axiosGetStub.calledOnce).toBe(true);
  });

  it('should throw an error if current currency rate is not available', async () => {
    const response = {
      data: [{ ccy: 'EUR', base_ccy: 'UAH', buy: 32.5, sale: 33.2 }],
    };
    axiosGetStub.resolves(response);

    await expect(ExchangerService.getCurrentRate()).rejects.toThrow('Service does not have information about current currency rate');
    expect(axiosGetStub.calledOnce).toBe(true);
  });
});
