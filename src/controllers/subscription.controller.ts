import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../models/status-codes.model';
import { SubscriptionsService } from '../services/subscription.service';
import { SubscriptionsRepository } from '../repositories/subscriprion.repository';

export async function subscribe(request: Request, response: Response) {
  const subscriptionRepository = new SubscriptionsService(new SubscriptionsRepository());
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(StatusCode.BadRequest).json(errors.array());
  }

  const email = request.body.email as string;
  const subscribed = await subscriptionRepository.findByEmail(email);
  if (subscribed) {
    return response.status(StatusCode.ExistingValue).json('Email is already subscribed');
  }
  await subscriptionRepository.create(email);
  return response.status(StatusCode.Success).json(`Email ${email} added to subscription`);
}
