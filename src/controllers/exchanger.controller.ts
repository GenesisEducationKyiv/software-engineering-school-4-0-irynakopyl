import { Request, Response } from 'express';
import { ExchangerService } from '../services/exchanger.service';
import { StatusCode } from '../models/status-codes.model';
import ukrainianBankExchangeHandler from '../services/bank-exchange-handler';

export async function getCurrentRate(req: Request, res: Response) {
  try {
    const currentRate = await new ExchangerService(ukrainianBankExchangeHandler).getCurrentRate();
    return res.status(StatusCode.Success).json(currentRate);
  } catch (error) {
    return res.status(StatusCode.InternalError).send(`Error getting current rate: ${JSON.stringify(error)}`);
  }
}
