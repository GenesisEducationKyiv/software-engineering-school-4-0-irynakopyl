import { Request, Response, Router } from 'express';
import { SubscriptionsService } from '../services/subscription.service';
import { body, validationResult } from 'express-validator';
import { StatusCode } from '../models/status-codes.model';

export const subscriptionRouter = Router();

subscriptionRouter.post(
  '/',
  [body('email').trim().isEmail().withMessage('Specify valid email')],
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(StatusCode.Invalid).json(errors.array);
    }

    const email = request.body.email as string;
    const subscriptionService = new SubscriptionsService();
    const subscribed = await subscriptionService.findByEmail(email);
    if (subscribed) {
      return response.status(StatusCode.ExistingValue).json('Email is already subscribed');
    }
    await subscriptionService.create(email);
    return response.status(StatusCode.Success).json(`Email ${email} added to subscription`);
  },
);
