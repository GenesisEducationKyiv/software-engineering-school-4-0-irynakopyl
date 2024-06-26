import { SchedulerService } from '../../service/services/scheduler.service';
import scheduler from 'node-schedule';

describe('SchedulerService', () => {
  jest.mock('node-schedule');
  let schedulerScheduleJobSpy: jest.SpyInstance;
  let schedulerGracefulShutdownSpy: jest.SpyInstance;

  beforeEach(() => {
    schedulerScheduleJobSpy = jest.spyOn(scheduler, 'scheduleJob');
    schedulerGracefulShutdownSpy = jest.spyOn(scheduler, 'gracefulShutdown');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeJob', () => {
    it('should call scheduler.scheduleJob with the provided cron schedule and job function', () => {
      const cronSchedule = '* * * * *';
      const jobFunction = jest.fn();

      SchedulerService.initializeJob(cronSchedule, jobFunction);

      expect(schedulerScheduleJobSpy).toHaveBeenCalledWith(cronSchedule, jobFunction);
    });
  });

  describe('shutdown', () => {
    it('should call scheduler.gracefulShutdown', async () => {
      await SchedulerService.shutdown();

      expect(schedulerGracefulShutdownSpy).toHaveBeenCalled();
    });
  });
});
