import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import { LANGUAGES_TYPE, THEMES_TYPE } from '../models';
import {
  ROOT_ROLE,
  VALIDATE_BOOLEAN_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_NON_EMPTY_USER_MSG,
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
    body('users')
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_USER_MSG)
      .custom((data) => {
        if (typeof data === 'object') {
          if (Array.isArray(data)) {
            data.forEach((user, i) => {
              if (!user.username) throw new Error(`username must be valid string from index ${i}`);
              if (!Array.isArray(user.roles) || user.roles?.includes(ROOT_ROLE)) throw new Error(`roles must be valid array from index ${i}`);
              if (!user.firstName) throw new Error(`firstName must be valid string from index ${i}`);
              if (!user.lastName) throw new Error(`lastName must be valid string from index ${i}`);
            });
          } else {
            if (!data.username || !(typeof data.username === 'string')) throw new Error('username must be valid string');
            if (!Array.isArray(data.roles) || data.roles?.includes(ROOT_ROLE)) throw new Error('roles must be valid array');
            if (!data.firstName || !(typeof data.firstName === 'string')) throw new Error('firstName must be valid string');
            if (!data.lastName || !(typeof data.lastName === 'string')) throw new Error('lastName must be valid string');
          }
          return true; // Validation passes
        }
        throw new Error('Data must be an object or array');
      }),
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

export function enableUserValidator() {
  return [
    body('userId', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('enable', VALIDATE_BOOLEAN_MSG)
      .isBoolean(),
  ];
}
