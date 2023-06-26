import { Request } from 'express';
import {
  body, param, ValidationError, validationResult,
} from 'express-validator';
import {
  CustomerLevel,
  SexType,
  HonorificType,
} from '../models/Customer';
import {
  VALIDATE_EMAIL_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_PHONE_MSG,
  VALIDATE_STRING_MSG,
} from './constants';

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

export function createCustomerValidator() {
  return [
    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('email').notEmpty())
      .isEmail(),

    body('primaryPhoneNumber', VALIDATE_PHONE_MSG)
      .custom((value: string) => {
        const regex = /^(0)(\d){9,10}$/;
        return value.match(regex);
      }),

    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),

    body('address', VALIDATE_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('sex')
      .if(body('sex').notEmpty())
      .isIn(Object.values(SexType)).withMessage(`property allow only in ${Object.values(SexType)}`),

    body('vocative')
      .if(body('vocative').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('level')
      .if(body('level').notEmpty())
      .isIn(Object.values(CustomerLevel)).withMessage(`property allow only in ${Object.values(CustomerLevel)}`),

    body('socialLink', VALIDATE_EMAIL_MSG)
      .if(body('socialLink').notEmpty())
      .notEmpty()
      .isEmail(),
  ];
}

export function updateCustomerValidator() {
  return [
    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('email').notEmpty())
      .isEmail(),

    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),

    body('address', VALIDATE_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('sex')
      .if(body('sex').notEmpty())
      .isIn(Object.values(SexType)).withMessage(`property allow only in ${Object.values(SexType)}`),

    body('vocative')
      .if(body('vocative').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('level')
      .if(body('level').notEmpty())
      .isIn(Object.values(CustomerLevel)).withMessage(`property allow only in ${Object.values(CustomerLevel)}`),

    body('socialLink', VALIDATE_EMAIL_MSG)
      .if(body('socialLink').notEmpty())
      .notEmpty()
      .isEmail(),
  ];
}

export function getCustomerValidator() {
  return [
    param('customerId')
      .notEmpty()
      .custom((value: string) => {
        const regex = /^(0)(\d){9,10}$/;
        return value.match(regex);
      }),
  ];
}

export function changeCustomerAssigneeValidator() {
  return [
    param('customerId')
      .notEmpty()
      .custom((value: string) => {
        const regex = /^(0)(\d){9,10}$/;
        return value.match(regex);
      }),
    body('assignee')
      .notEmpty()
      .isString(),
  ];
}
