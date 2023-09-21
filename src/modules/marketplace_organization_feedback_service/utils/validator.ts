import { Request } from 'express';
import {
  body, param, query, ValidationError, validationResult,
} from 'express-validator';

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorGroups: { [key: string]: ValidationError[] } = {};
    errors.array().forEach((err) => {
      const location = err.location || 'unknown';
      const errs: ValidationError[] = errorGroups[location] || [];
      errs.push(err);
      errorGroups[location] = errs;
    });
    const msgs = Object.entries(errorGroups)
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}, value=${err.value}`).join('; ')}`);
    throw new Error(msgs.join('\n'));
  }
}

export function createOrgFeedbackValidator() {
  return [
    body('description')
      .isString()
      .notEmpty()
      .withMessage('must be not empty'),
  ];
}

export function updateOrgFeedbackValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
    param('feedbackId').notEmpty().withMessage('is required'),
    body('description')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('must be a string'),
  ];
}

export function getOrgFeedbackListValidator() {
  return [
    query('nextToken')
      .optional()
      .custom((value: string) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      })
      .withMessage('must be a JSON string'),
    query('limit')
      .optional()
      .isInt()
      .withMessage('must be a number'),
    query('sortType')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('property must be one of ASC, DESC'),
  ];
}
