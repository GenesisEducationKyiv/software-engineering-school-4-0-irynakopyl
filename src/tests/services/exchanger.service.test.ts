import { ExchangerService } from '../../services/exchanger.service';
import sinon from 'sinon';
import { Currency } from '../../models/currency';

describe('ExchangerService', () => {
  const exchangeClientMock = { getCurrencyRates: sinon.stub() };

  afterEach(() => sinon.restore());

  it('should return the current USD rate', async () => {
    exchangeClientMock.getCurrencyRates.resolves([
      { ccy: 'USD', base_ccy: 'UAH', buy: 27.5, sale: 28.1 },
      { ccy: 'EUR', base_ccy: 'UAH', buy: 32.5, sale: 33.2 },
    ]);
    const usdRate = await new ExchangerService(exchangeClientMock).getCurrentRate(Currency.USD);

    expect(usdRate).toBe(28.1);
  });

  it('should throw an error if current currency rate is not available', async () => {
    exchangeClientMock.getCurrencyRates.resolves([{ ccy: 'EUR', base_ccy: 'UAH', buy: 32.5, sale: 33.2 }]);
    await expect(new ExchangerService(exchangeClientMock).getCurrentRate(Currency.USD)).rejects.toThrow(
      'Service does not have information about current currency rate',
    );
  });
});
