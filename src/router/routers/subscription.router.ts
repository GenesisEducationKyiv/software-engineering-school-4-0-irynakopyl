import { Router } from 'express';
import * as SubscriptionController from '../../subscription/presentation/controllers/subscription.controller';

import { createSubscriprionRules } from '../../subscription/presentation/rules/subscription.rules';

export const subscriptionRouter = Router();

subscriptionRouter.post('/', createSubscriprionRules, SubscriptionController.subscribe);
