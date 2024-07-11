import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../../../common/models/status-codes.model';
import { serviceLocator } from '../../../common/service-locator';

export async function subscribe(request: Request, response: Response) {
  const subscriptionService = serviceLocator().subscriptionService();
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

export async function unsubscribe(request: Request, response: Response) {
  const subscriptionService = serviceLocator().subscriptionService();
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(StatusCode.BadRequest).json(errors.array());
  }

  const email = request.params.email as string;
  const subscribed = await subscriptionService.findByEmail(email);
  if (!subscribed) {
    return response.status(StatusCode.BadRequest).json('Please double-check the email address');
  }
  await subscriptionService.delete(email);
  return response.status(StatusCode.Success).json(`Email ${email} removed from subscription`);
}
