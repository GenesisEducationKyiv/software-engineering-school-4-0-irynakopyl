import { EventProducer } from '../../common/services/messaging/event-producer';
import { config } from '../../config';
import { SchedulerService } from '../../common/services/scheduler.service';
import { SystemEventType } from '../../common/models/system-event.model';
import logger from '../../common/services/logger.service';

export interface ExchangeClient {
  getCurrencyRate(): Promise<number>;
}

export class ExchangerService {
  constructor(private exchangerHandler: ExchangeClient) {}

  public async provideScheduledRateUpdates(eventProducer: EventProducer): Promise<void> {
    SchedulerService.initializeJob(config.cron.fetchRateSchedule, async () => {
      const currentRate = await this.exchangerHandler.getCurrencyRate();
      logger.debug(`Fetched currency rate: ${currentRate} and sending to the queue`);
      await eventProducer.sendEvent(config.messageBroker.topics.rate, {
        data: { currencyRate: currentRate },
        eventType: SystemEventType.CurrencyRateUpdated,
      });
    });
  }

  public async getCurrentRate(): Promise<number> {
    return this.exchangerHandler.getCurrencyRate();
  }
}
