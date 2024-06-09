import { Request, Response } from 'express';
import { ExchangerService } from '../services/exhanger.service';
import { StatusCode } from '../models/status-codes.model';

export class ExchangerController {
  async getCurrentRate(req: Request, res: Response) {
    const currentRate = await ExchangerService.getCurrentRate();
    if (!currentRate) {
      res.status(StatusCode.Invalid).json('Invalid status value');
    }
    res.status(StatusCode.Success).json(currentRate);
  }
}
