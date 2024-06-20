import { Request, Response } from 'express';
import { ExchangerService } from '../services/exhanger.service';
import { StatusCode } from '../models/status-codes.model';
import { Privat24Client } from '../services/exchangers/privat24Client';
import { Currency } from '../models/currency';

export async function getCurrentRate(req: Request, res: Response): Promise<void> {
  const currentRate = await new ExchangerService(new Privat24Client()).getCurrentRate(Currency.USD);
  if (!currentRate) {
    res.status(StatusCode.BadRequest).json('Invalid status value');
  }
  res.status(StatusCode.Success).json(currentRate);
}
