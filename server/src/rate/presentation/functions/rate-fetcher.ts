import { serviceLocator } from '../../../common/service-locator';
import { ExchangerService } from '../../service/exchanger.service';

export async function setupRateFetcher(): Promise<ExchangerService> {
  const exchangerService = serviceLocator().exchangerService();
  const eventProducer = await serviceLocator().eventProducer();
  exchangerService.provideScheduledRateUpdates(eventProducer);
  return exchangerService;
}
