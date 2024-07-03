import { Request, Response } from 'express';
import { ExchangerService } from '../../service/exchanger.service';
import { StatusCode } from '../../../common/models/status-codes.model';
import { MonobankClient } from '../../data-access/exchangers/monobank-client';
import { NBUClient } from '../../data-access/exchangers/nbu-client';
import { Privat24Client } from '../../data-access/exchangers/privat24-client';
import { BanksExchangeHandler } from '../../service/bank-exchange-handler';

export async function getCurrentRate(req: Request, res: Response) {
  try {
    const monobankHandler = new BanksExchangeHandler(new MonobankClient());
    const nbuHandler = new BanksExchangeHandler(new NBUClient());
    const privat24Handler = new BanksExchangeHandler(new Privat24Client());
    const bankExchangeHandler = monobankHandler.setNext(nbuHandler).setNext(privat24Handler);
    const currentRate = await new ExchangerService(bankExchangeHandler).getCurrentRate();
    return res.status(StatusCode.Success).json(Number(currentRate));
  } catch (error) {
    return res.status(StatusCode.InternalError).send(`Error getting current rate: ${JSON.stringify(error)}`);
  }
}
