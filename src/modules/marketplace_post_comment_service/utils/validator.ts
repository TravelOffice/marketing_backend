import { Request } from 'express';
import {
  body, param, ValidationError, validationResult,
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

export function createCommentValidator() {
  return [
    param('id').notEmpty().withMessage('Tour Post ID is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description must be not empty'),
  ];
}

export function updateCommentValidator() {
  return [
    param('id').notEmpty().withMessage('Tour Post ID is required'),
    param('commentId').notEmpty().withMessage('Post Comment ID is required'),
    body('description').if(body('description').exists())
      .isString()
      .notEmpty()
      .withMessage('description must be a string'),
  ];
}

export function getPostCommentListValidator() {
  return [
    body('nextToken').if(body('nextToken').exists())
      .custom((value: string) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      })
      .withMessage('must be a JSON string'),
    body('limit').if(body('limit').exists())
      .isInt()
      .withMessage('limit must be a number'),
    body('sortDesc').if(body('sortDesc').exists())
      .isBoolean()
      .withMessage('sortDesc must be a boolean'),
  ];
}
