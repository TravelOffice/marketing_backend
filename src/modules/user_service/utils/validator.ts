import { Request } from 'express';
import {
  ValidationError, validationResult,
  body,
} from 'express-validator';
import { LANGUAGES_TYPE, ROLES_TYPE, THEMES_TYPE } from '../models/User';
import {
  USERNAME_DELIMITER,
  VALIDATE_EMAIL_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_USERNAME_SYNTAX_STRING_MSG,
} from './constants';

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
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}, value=${JSON.stringify(err.value)}`).join('; ')}`);
    throw new Error(msgs.join('\n'));
  }
}

export function createTenantUserValidator() {
  const createTenantAllowedKeys = [
    'username',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'role',
  ];

  return [
    body().custom((value) => {
      const keys = Object.keys(value);
      return !keys.some((key) => !createTenantAllowedKeys.includes(key));
    }).withMessage(`property only allow in ${Object.values(createTenantAllowedKeys)}`),

    body('username', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString()
      .not()
      .contains(USERNAME_DELIMITER)
      .withMessage(VALIDATE_USERNAME_SYNTAX_STRING_MSG),

    body('firstName', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('lastName', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('email', VALIDATE_EMAIL_MSG)
      .notEmpty()
      .isEmail(),

    body('phoneNumber', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),

    body('role')
      .notEmpty()
      .isIn(Object.values(ROLES_TYPE)).withMessage(`allow only in ${Object.values(ROLES_TYPE)}`),
  ];
}

export function updateTenantUserValidator() {
  const updateTenantAllowedKeys = [
    'firstName',
    'lastName',
    'avatar',
    'email',
    'phoneNumber',
    'role',
    'settings',
    'createdAt',
    'updatedAt',
  ];
  const settingsAllowedkeys = [
    'theme',
    'language',
  ];
  return [
    body().custom((value) => {
      const keys = Object.keys(value);
      return !keys.some((key) => !updateTenantAllowedKeys.includes(key));
    }).withMessage(`property only allow in ${Object.values(updateTenantAllowedKeys)}`),

    body('firstName', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('lastName', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('email', VALIDATE_EMAIL_MSG)
      .optional()
      .isEmail(),

    body('phoneNumber', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('role')
      .optional()
      .isIn(Object.values(ROLES_TYPE)).withMessage(`allow only in ${Object.values(ROLES_TYPE)}`),

    body('avatar', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

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
