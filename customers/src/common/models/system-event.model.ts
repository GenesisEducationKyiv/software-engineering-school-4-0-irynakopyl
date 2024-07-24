export interface SystemEvent {
  eventId: string;
  eventType: SystemEventType;
  timestamp: Date;
  data: any;
}

export enum SystemEventType {
  CustomerCreate = 'customer.create',
  CustomerDeleted = 'customer.deleted',

  CustomerCreated = 'customer.created',
}
