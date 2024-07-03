import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../../../common/models/status-codes.model';
import { SubscriptionsService } from '../../service/services/subscription.service';
import { SubscriptionsRepository } from '../../data-access/repositories/subscription.repository';

export async function subscribe(request: Request, response: Response) {
  const subscriptionService = new SubscriptionsService(new SubscriptionsRepository());
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(StatusCode.BadRequest).json(errors.array());
  }

  const email = request.body.email as string;
  const subscribed = await subscriptionService.findByEmail(email);
  if (subscribed) {
    return response.status(StatusCode.ExistingValue).json('Email is already subscribed');
  }
  await subscriptionService.create(email);
  return response.status(StatusCode.Success).json(`Email ${email} added to subscription`);
}
