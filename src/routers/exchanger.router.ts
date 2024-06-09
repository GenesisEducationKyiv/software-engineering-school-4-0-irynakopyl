import { Router } from 'express';
import { ExchangerController } from '../controllers/exchanger.controller';

export const exchangerRouter = Router();
const exchangerController = new ExchangerController();
exchangerRouter.get('/', exchangerController.getCurrentRate);
