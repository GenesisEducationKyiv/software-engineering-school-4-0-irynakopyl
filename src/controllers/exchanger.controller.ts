import { Request, Response } from 'express';
import { ExchangerService } from '../services/exhanger.service';
import { StatusCode } from '../models/status-codes.model';

export async function getCurrentRate(req: Request, res: Response): Promise<void> {
  const currentRate = await ExchangerService.getCurrentRate();
  if (!currentRate) {
    res.status(StatusCode.BadRequest).json('Invalid status value');
  }
  res.status(StatusCode.Success).json(currentRate);
}
