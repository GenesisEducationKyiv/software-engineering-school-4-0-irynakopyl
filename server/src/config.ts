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
  api: {
    currency: {
      privat: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5',
      nbu: 'https://bank.gov.ua/NBUStatService/v1',
      mono: 'https://api.monobank.ua/bank/currency',
    },
  },
  cron: {
    fetchRateSchedule: '0 8 * * *',
  },
  messageBroker: {
    broker: String(process.env.KAFKA_BROKER),
    topics: {
      rate: 'rate-events',
      subscription: 'subscription-events',
    },
    groupId: 'app-group',
  },
};
