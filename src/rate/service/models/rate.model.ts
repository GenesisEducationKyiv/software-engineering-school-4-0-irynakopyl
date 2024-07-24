import { Currency } from './currency';

export interface Rate {
  createdAt: Date;
  value: number;
  currency: Currency;
}
