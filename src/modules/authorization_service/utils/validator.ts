import { Request } from 'express';
import {
  body,
  ValidationError,
  validationResult,
} from 'express-validator';
import {
  VALIDATE_ARRAY_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_ROLE_NAME_REGEX,
  VALIDATE_ROLE_NAME_SYNTAX_STRING_MSG,
  VALIDATE_USERNAME_RESERVED_STRING_MSG,
} from './constants';

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
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}, value=${JSON.stringify(err.value)}`).join('; ')}`);
    throw new Error(msgs.join('\n'));
  }
}

export function createRoleValidator() {
  const allowedKeys = [
    'name',
    'permissions',
  ];

  const reservedRoleNames = [
    'ROOT',
    'ADMIN',
    'SALE',
  ];

  return [
    body().custom((value) => {
      const keys = Object.keys(value);
      return !keys.some((key) => !allowedKeys.includes(key));
    }).withMessage(`property only allow in ${Object.values(allowedKeys)}`),

    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString()
      .custom((value: string) => value.match(VALIDATE_ROLE_NAME_REGEX))
      .withMessage(VALIDATE_ROLE_NAME_SYNTAX_STRING_MSG)
      .not()
      .isIn(reservedRoleNames)
      .withMessage(VALIDATE_USERNAME_RESERVED_STRING_MSG),

    body('permissions')
      .notEmpty()
      .isArray().withMessage(VALIDATE_ARRAY_MSG),
  ];
}
