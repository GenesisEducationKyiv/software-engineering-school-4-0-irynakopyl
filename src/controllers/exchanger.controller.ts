import { Request, Response } from 'express';
import { ExchangerService } from '../services/exchanger.service';
import { StatusCode } from '../models/status-codes.model';
import { Privat24Client } from '../services/exchangers/privat24-client';
import { Currency } from '../models/currency';

export async function getCurrentRate(req: Request, res: Response) {
  try {
    const currentRate = await new ExchangerService(new Privat24Client()).getCurrentRate(Currency.USD);
    return res.status(StatusCode.Success).json(currentRate);
  } catch (error) {
    return res.status(StatusCode.InternalError).send('Internal error');
  }
}
