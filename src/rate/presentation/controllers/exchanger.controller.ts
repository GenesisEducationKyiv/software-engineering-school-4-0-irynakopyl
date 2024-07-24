import { Request, Response } from 'express';
import { ExchangerService } from '../../service/exchanger.service';
import { StatusCode } from '../../../common/models/status-codes.model';
import { serviceLocator } from '../../../common/service-locator';

export async function getCurrentRate(req: Request, res: Response) {
  try {
    const bankExchangeHandler = serviceLocator().banksExchangeHandler();
    const currentRate = await new ExchangerService(bankExchangeHandler).getCurrentRate();
    return res.status(StatusCode.Success).json(Number(currentRate));
  } catch (error) {
    return res.status(StatusCode.InternalError).send(`Error getting current rate: ${JSON.stringify(error)}`);
  }
}
