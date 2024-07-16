import { Router } from 'express';
import * as SubscriptionController from '../controllers/subscription.controller';

import { unsubscribeRules, createSubscriprionRules } from '../rules/subscription.rules';

export const subscriptionRouter = Router();

subscriptionRouter.post('/', createSubscriprionRules, SubscriptionController.subscribe);

subscriptionRouter.delete('/:email', unsubscribeRules, SubscriptionController.unsubscribe);
