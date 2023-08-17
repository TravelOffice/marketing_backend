import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import { LANGUAGES_TYPE, THEMES_TYPE } from '../models';
import {
  ROOT_ROLE,
  VALIDATE_ARRAY_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_ROLE_MSG,
  VALIDATE_URL_MSG,
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

export function createUserValidator() {
  return [
    body('tenant', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('username', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),

    body('roles')
      .isArray({ min: 1 }).withMessage(VALIDATE_ARRAY_MSG)
      .custom((value: Array<string>) => !value.includes(ROOT_ROLE))
      .withMessage(VALIDATE_ROLE_MSG),
  ];
}

export function updateUserValidator() {
  const settingsAllowedkeys = [
    'theme',
    'language',
  ];
  return [
    body('alias', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString()
      .notEmpty(),

    body('description', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString()
      .notEmpty(),

    body('avatar', VALIDATE_URL_MSG)
      .optional()
      .isURL(),

    body('settings').optional()
      .isObject().withMessage('Settings must be Object')
      .custom((value) => {
        const keys = Object.keys(value);
        return !keys.some((key) => !settingsAllowedkeys.includes(key));
      })
      .withMessage(`property only allow in ${Object.values(settingsAllowedkeys)}`),

    body('settings.theme')
      .if(body('settings').exists())
      .optional()
      .isIn(Object.values(THEMES_TYPE))
      .withMessage(`allow only in ${Object.values(THEMES_TYPE)}`),
    body('settings.language')
      .if(body('settings').exists())
      .optional()
      .isIn(Object.values(LANGUAGES_TYPE))
      .withMessage(`allow only in ${Object.values(LANGUAGES_TYPE)}`),
  ];
}
