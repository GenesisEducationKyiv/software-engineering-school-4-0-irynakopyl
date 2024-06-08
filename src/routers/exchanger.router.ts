import { Request, Response, Router } from 'express';
import { ExchangerService } from '../services/exhanger.service';
import { StatusCode } from '../models/status-codes.model';

export const exchangerRouter = Router();

exchangerRouter.get('/', async (request: Request, response: Response) => {
  const currentRate = await ExchangerService.getCurrentRate();
  if (!currentRate) {
    response.status(StatusCode.Invalid).json('Invalid status value');
  }
  response.status(StatusCode.Success).json(currentRate);
});
