import { Router } from 'express';
import * as ExchangerController from '../../rate/presentation/controllers/exchanger.controller';

export const exchangerRouter = Router();
exchangerRouter.get('/', ExchangerController.getCurrentRate);
