import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../models/status-codes.model';
import { SubscriptionsService } from '../services/subscription.service';

export class SubscriptionController {
  private subscriptionService: SubscriptionsService;

  constructor() {
    this.subscriptionService = new SubscriptionsService();
  }

  async subscribe(request: Request, response: Response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(StatusCode.UnprocessableEntity).json(errors.array());
    }

    const email = request.body.email as string;
    const subscribed = await this.subscriptionService.findByEmail(email);
    if (subscribed) {
      return response.status(StatusCode.ExistingValue).json('Email is already subscribed');
    }
    await this.subscriptionService.create(email);
    return response.status(StatusCode.Success).json(`Email ${email} added to subscription`);
  }
}
