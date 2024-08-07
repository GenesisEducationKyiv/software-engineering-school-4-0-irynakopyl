export interface SystemEvent {
  eventId: string;
  eventType: SystemEventType;
  timestamp: Date;
  data: any;
}

export enum SystemEventType {
  CurrencyRateUpdated = 'currency-rate.updated',
}
