import { Request } from 'express';
import {
  body, check, header, ValidationError, validationResult,
} from 'express-validator';

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => `Validate failed at ${error.location}: ${error.msg} ${error.param}`);
    const errorGroups : {[key: string]: ValidationError[]} = {};
    errors.array().forEach((err) => {
      const location = err.location || 'unknown';
      const errs : ValidationError[] = errorGroups[location] || [];
      errs.push(err);
      errorGroups[location] = errs;
    });
    const msgs = Object.entries(errorGroups)
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}, value=${err.value}`).join('; ')}`);
    throw new Error(msgs.join('\n'));
  }
}

export function linkZaloPageValidator() {
  return [
    body('authorizationCode', 'is required').not().isEmpty(),
    body('pageId', 'is required').not().isEmpty(),
    body('state', 'is required').not().isEmpty(),
  ];
}
