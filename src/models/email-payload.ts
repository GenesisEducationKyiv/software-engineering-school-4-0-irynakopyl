export interface EmailPayload {
  from: string;
  to: string;
  message: string;
  subject: string;
}

export interface CurrencyRateEmailPayload {
  currencyRate: number;
  to: string;
}
