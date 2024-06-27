import { Router } from 'express';
import * as SubscriptionController from '../controllers/subscription.controller';

import { createSubscriprionRules } from '../rules/subscription.rules';

export const subscriptionRouter = Router();

subscriptionRouter.post('/', createSubscriprionRules, SubscriptionController.subscribe);
