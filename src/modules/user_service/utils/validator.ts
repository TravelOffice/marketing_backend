import { ChatPlatform } from 'common-models';
import { Request } from 'express';
import {
  body,
  query, ValidationError, validationResult,
} from 'express-validator';
import {
  LANGUAGES_TYPE, SexEnum, THEMES_TYPE, UserStatusEnum,
} from '../models';
import {
  ROOT_ROLE,
  USERNAME_DELIMITER,
  VALIDATE_ARRAY_MSG,
  VALIDATE_DATE_MSG,
  VALIDATE_EMAIL_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_ROLE_MSG,
  VALIDATE_USERNAME_POLICY_MSG,
  VALIDATE_USERNAME_RESERVED_STRING_MSG,
  VALIDATE_USERNAME_SYNTAX_STRING_MSG,
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

export function createTenantUserValidator() {
  const createTenantAllowedKeys = [
    'username',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'roles',
    'sex',
    'birthday',
    'address',
    'status',
  ];

  const reservedUsernames = [
    'unknown',
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
      .withMessage(VALIDATE_USERNAME_SYNTAX_STRING_MSG)
      .not()
      .isIn(reservedUsernames)
      .withMessage(VALIDATE_USERNAME_RESERVED_STRING_MSG)
      .matches(/^[0-9a-zA-Z]+$/)
      .withMessage(VALIDATE_USERNAME_POLICY_MSG),

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

    body('roles')
      .notEmpty()
      .isArray().withMessage(VALIDATE_ARRAY_MSG)
      .custom((value) => !value.includes(ROOT_ROLE))
      .withMessage(VALIDATE_ROLE_MSG),

    body('birthday', VALIDATE_DATE_MSG)
      .if(body('birthday').notEmpty())
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),

    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('sex')
      .optional()
      .isIn(Object.values(SexEnum)).withMessage(`allow only in ${Object.values(SexEnum)}`),

    body('status')
      .optional()
      .isIn(Object.values(UserStatusEnum)).withMessage(`allow only in ${Object.values(UserStatusEnum)}`),
  ];
}

export function updateTenantUserValidator() {
  const updateTenantAllowedKeys = [
    'firstName',
    'lastName',
    'avatar',
    'email',
    'phoneNumber',
    'roles',
    'settings',
    'createdAt',
    'updatedAt',
    'sex',
    'birthday',
    'address',
    'status',
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

    body('roles')
      .optional()
      .isArray().withMessage(VALIDATE_ARRAY_MSG)
      .custom((value: Array<string>) => !value.includes(ROOT_ROLE))
      .withMessage(VALIDATE_ROLE_MSG),

    body('birthday', VALIDATE_DATE_MSG)
      .optional()
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),

    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('sex')
      .optional()
      .isIn(Object.values(SexEnum)).withMessage(`allow only in ${Object.values(SexEnum)}`),

    body('avatar', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),

    body('status')
      .optional()
      .isIn(Object.values(UserStatusEnum)).withMessage(`allow only in ${Object.values(UserStatusEnum)}`),

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

export function unlinkPageValidator() {
  return [
    query('platform')
      .isIn(Object.values(ChatPlatform)).withMessage(`allow only in ${Object.values(ChatPlatform)}`),
    query('pageId')
      .notEmpty()
      .isString(),
  ];
}
