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
    },
    currency: {
      privat: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5',
      nbu: 'https://bank.gov.ua/NBUStatService/v1',
      mono: 'https://api.monobank.ua/bank/currency',
    },
  },
  cron: {
    currencyRateEmailSchedule: '0 0 * * *',
  },
};
