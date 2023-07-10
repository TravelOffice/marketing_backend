import { Request } from 'express';
import {
  body, ValidationError, validationResult,
} from 'express-validator';
import { VALIDATE_NON_EMPTY_STRING_MSG } from './constants';

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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

export function createSourceValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
  ];
}

export function updateSourceValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('name').notEmpty())
      .isString(),
  ];
}
