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

export function createRatingValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
    body('star')
      .isInt({ min: 1, max: 5 })
      .withMessage('must be a number between 1 and 5'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('must be not empty'),
  ];
}

export function updateRatingValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
    param('ratingId').notEmpty().withMessage('is required'),
    body('star')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('must be a number between 1 and 5'),
    body('description')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('description must be a string'),
  ];
}

export function getPostRatingListValidator() {
  return [
    query('organization')
      .isString()
      .notEmpty()
      .withMessage('must be a string'),
  ];
}

export function deletePostRatingValidator() {
  return [
    body('organization')
      .isString()
      .notEmpty()
      .withMessage('must be a string'),
  ];
}

export function getOrgRatingListValidator() {
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
    query('sortDesc')
      .optional()
      .isBoolean()
      .withMessage('must be a boolean'),
  ];
}
