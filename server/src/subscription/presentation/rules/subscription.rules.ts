import { body, param } from 'express-validator';

export const createSubscriprionRules = [body('email').trim().isEmail().withMessage('Specify valid email')];

export const unsubscribeRules = [param('email').trim().isEmail().withMessage('Specify valid email')];
