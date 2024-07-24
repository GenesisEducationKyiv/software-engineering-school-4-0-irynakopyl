export interface SystemEvent {
  eventId: string;
  eventType: SystemEventType;
  timestamp: Date;
  data: any;
}

export enum SystemEventType {
  SubscriptionCreated = 'subscription.created',
  CreateCustomer = 'customer.create',
  CustomerCreated = 'customer.created',
}
