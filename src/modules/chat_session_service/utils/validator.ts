import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import { VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_STRING_MSG } from './constants';

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

export function createSessionValidator() {
  return [
    body('conversationId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
  ];
}

export function updateSessionValidator() {
  return [
    body('latestMessage').optional().isString().withMessage(VALIDATE_STRING_MSG),
  ];
}

export function closeSessionValidator() {
  return [
    body('latestMessage').notEmpty().isString().withMessage(VALIDATE_STRING_MSG),
  ];
}
