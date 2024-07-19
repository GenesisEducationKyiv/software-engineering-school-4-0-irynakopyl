import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  messageBroker: {
    broker: String(process.env.KAFKA_BROKER),
    topics: {
      subscription: 'subscription-events',
      customer: 'customers-events',
      customersTransaction: 'customers-transaction-events',
      subscriptionTransaction: 'subscription-transaction-events',
    },
    groupId: 'app-group',
  },
};
