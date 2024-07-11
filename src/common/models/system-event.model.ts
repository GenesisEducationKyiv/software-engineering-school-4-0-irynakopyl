export interface SystemEvent {
  eventId: string;
  eventType: SystemEventType;
  timestamp: Date;
  data: any;
}

export enum SystemEventType {
  CurrencyRateEmail = 'email.currency-rate-daily',
}
