import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    database: String(process.env.DB_NAME),
    username: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
  },
  messageBroker: {
    broker: String(process.env.KAFKA_BROKER),
    topics: {
      customers: 'customers-events',
      customersTransaction: 'customers-transaction-events',
    },
    groupId: 'app-group',
  },
};
