import { Router } from 'express';
import { ExchangerService } from '../services/exhanger.service';
import { invalidStatusCode, successStatusCode } from '../models/status-codes.model';

export const exchangerRouter = Router();

exchangerRouter.get('/', async (request, response) => {
  const currentRate = await ExchangerService.getCurrentRate();
  if (!currentRate) {
    response.status(invalidStatusCode).json('Invalid status value');
  }
  response.status(successStatusCode).json(currentRate);
});
