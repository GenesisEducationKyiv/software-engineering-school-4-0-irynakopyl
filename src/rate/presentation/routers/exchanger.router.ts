import { Router } from 'express';
import * as ExchangerController from '../controllers/exchanger.controller';

export const exchangerRouter = Router();
exchangerRouter.get('/', ExchangerController.getCurrentRate);
