import { Request, Response } from 'express';
import { ExchangerService } from '../services/exhanger.service';
import { StatusCode } from '../models/status-codes.model';

export async function getCurrentRate(req: Request, res: Response): Promise<void> {
  try {
    const currentRate = await ExchangerService.getCurrentRate();
    res.status(StatusCode.Success).json(currentRate);
  } catch (error) {
    const errorMessage = `Error received while getting current rate: ${JSON.stringify(error)}`;
    console.log(errorMessage);
    res.status(StatusCode.InternalError).send(errorMessage);
  }
}
