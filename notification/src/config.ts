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
    emailServer: {
      user: String(process.env.AUTH_EMAIL),
      password: String(process.env.AUTH_PASSWORD),
      rateLimit: 100,
      host: String(process.env.EMAIL_HOST),
      port: String(process.env.EMAIL_PORT),
    },
  },
  cron: {
    currencyRateEmailSchedule: '0 0 * * *',
  },
  messageBroker: {
    broker: String(process.env.KAFKA_BROKER),
    topics: {
      rate: 'rate-events',
      notification: 'notification-events',
    },
    groupId: 'app-group',
  },
};
