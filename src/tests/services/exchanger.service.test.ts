import { ExchangerService } from '../../service/services/exchanger.service';
import sinon from 'sinon';

describe('ExchangerService', () => {
  const exchangeClientMock = { getCurrencyRate: sinon.stub() };

  afterEach(() => sinon.restore());

  it('should return the current USD rate', async () => {
    exchangeClientMock.getCurrencyRate.resolves(28.1);
    const usdRate = await new ExchangerService(exchangeClientMock).getCurrentRate();

    expect(usdRate).toBe(28.1);
  });

  it('should throw an error if current currency rate is not available', async () => {
    exchangeClientMock.getCurrencyRate.rejects(new Error('Service does not have information about current currency rate'));
    await expect(new ExchangerService(exchangeClientMock).getCurrentRate()).rejects.toThrow(
      'Service does not have information about current currency rate',
    );
  });
});
