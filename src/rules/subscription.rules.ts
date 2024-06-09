import { body } from 'express-validator';

export const createSubscriprionRules = [body('email').trim().isEmail().withMessage('Specify valid email')];
