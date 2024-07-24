import { EventProducer } from '../../common/services/messaging/event-producer';
import { config } from '../../config';
import { SchedulerService } from '../../common/services/scheduler.service';
import { v4 as uuidv4 } from 'uuid';
import { SystemEventType } from '../../common/models/system-event.model';

export interface ExchangeClient {
  getCurrencyRate(): Promise<number>;
}

export class ExchangerService {
  constructor(private exchangerHandler: ExchangeClient) {}

  public async provideScheduledRateUpdates(eventProducer: EventProducer): Promise<void> {
    SchedulerService.initializeJob(config.cron.fetchRateSchedule, async () => {
      const currentRate = await this.exchangerHandler.getCurrencyRate();
      await eventProducer.sendEvent(config.messageBroker.topics.rate, {
        data: { currencyRate: currentRate },
        timestamp: new Date(),
        eventType: SystemEventType.CurrencyRateUpdated,
        eventId: uuidv4(),
      });
    });
  }

  public async getCurrentRate(): Promise<number> {
    return this.exchangerHandler.getCurrencyRate();
  }
}
