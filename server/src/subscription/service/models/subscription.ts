export interface Subscription {
  id: string;
  email: string;
  createdAt: Date;
  deletedAt?: Date;
  isSetupDone: boolean;
}
