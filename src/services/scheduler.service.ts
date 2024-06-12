import scheduler from 'node-schedule';
import { sendDailyRateEmail } from '../jobs/rates-notification.job';

export class SchedulerService {
  public static initializeJob(cronSchedule: string, jobFunction: () => Promise<void>): void {
    scheduler.scheduleJob(cronSchedule, jobFunction);
  }

  public static async shutdown(): Promise<void> {
    await scheduler.gracefulShutdown();
  }
}
