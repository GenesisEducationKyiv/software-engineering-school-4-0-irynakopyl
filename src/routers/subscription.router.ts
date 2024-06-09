import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { createSubscriprionRules } from '../rules/subscription.rules';

export const subscriptionRouter = Router();
const subscriptionController = new SubscriptionController();

subscriptionRouter.post('/', createSubscriprionRules, subscriptionController.subscribe);
