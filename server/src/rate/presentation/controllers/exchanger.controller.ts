import { Request, Response } from 'express';
import { StatusCode } from '../../../common/models/status-codes.model';
import { serviceLocator } from '../../../common/service-locator';

export async function getCurrentRate(req: Request, res: Response) {
  try {
    const exchangerService = serviceLocator().exchangerService();
    const currentRate = await exchangerService.getCurrentRate();
    return res.status(StatusCode.Success).json(Number(currentRate));
  } catch (error) {
    return res.status(StatusCode.InternalError).send(`Error getting current rate: ${JSON.stringify(error)}`);
  }
}
