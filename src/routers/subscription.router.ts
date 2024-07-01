import { Router } from 'express';
import * as SubscriptionController from '../subscription/subscription.controller';

import { createSubscriprionRules } from '../subscription/rules/subscription.rules';

export const subscriptionRouter = Router();

subscriptionRouter.post('/', createSubscriprionRules, SubscriptionController.subscribe);
