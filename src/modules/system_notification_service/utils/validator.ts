import { Request } from 'express';
import {
  body, query, ValidationError, validationResult,
} from 'express-validator';
import { AppTypeEnum, appTypes, deviceTypes } from '../models/UserDeviceSession';
import { VALIDATE_REQUIRED_MSG, VALIDATE_STRING_MSG } from './constants';

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

export function createUserDeviceSession() {
  const stringAttrs = ['token', 'name', 'userAgent', 'os'];
  const stringValidators = stringAttrs.map((attr) => body(attr)
    .notEmpty()
    .withMessage(VALIDATE_REQUIRED_MSG)
    .isString()
    .withMessage(VALIDATE_STRING_MSG));
  return [
    ...stringValidators,
    body('type')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isIn(deviceTypes)
      .withMessage(`property allow only in ${deviceTypes}`),
  ];
}

export function getMyNotificationsValidator() {
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
    query('limit').optional().isInt().withMessage('must be a number'),
    query('sortType')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('property must be one of ASC, DESC'),
    query('appType')
      .isIn(Object.values(AppTypeEnum)).withMessage(`must be one of ${Object.values(AppTypeEnum)}`),
  ];
}

export function markAsReadValidator() {
  return [
    body('notificationId').isString().notEmpty().withMessage('must be a string'),
    body('appType')
      .isIn(appTypes).withMessage(`must be one of ${appTypes}`),
  ];
}

export function markAllReadValidator() {
  return [
    body('markedTime').notEmpty().custom((value) => !Number.isNaN(value) && Number.isFinite(value)),
    body('appType')
      .isIn(appTypes).withMessage(`must be one of ${appTypes}`),
  ];
}
