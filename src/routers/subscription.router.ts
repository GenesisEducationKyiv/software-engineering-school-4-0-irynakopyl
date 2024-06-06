import { Router } from 'express';
import { SubscriptionsService } from '../services/subscription.service';
import { body } from 'express-validator';
import { existingValueStatusCode, successStatusCode } from '../models/status-codes.model';

export const subscriptionRouter = Router();

subscriptionRouter.post('/', body('email').trim().isEmail().withMessage('Specify valid email'), async (request, response) => {
  const email = request.body.email as string;
  const subscriptionService = new SubscriptionsService();
  const subscribed = await subscriptionService.findByEmail(email);
  if (subscribed) {
    return response.status(existingValueStatusCode).json('Email is already subscribed');
  }
  await subscriptionService.create(email);
  return response.status(successStatusCode).json(`Email ${email} added to subscription`);
});
