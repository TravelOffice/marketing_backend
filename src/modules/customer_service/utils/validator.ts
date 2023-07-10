import { Request } from 'express';
import {
  body, param, ValidationError, validationResult,
} from 'express-validator';
import {
  CustomerLevel,
  SexType,
  HonorificType,
  MaritalStatus,
} from '../models/Customer';
import {
  VALIDATE_DATE_MSG,
  VALIDATE_EMAIL_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_PHONE_ARRAY_MSG,
  VALIDATE_PHONE_MSG,
  VALIDATE_STRING_ARRAY_MSG,
  VALIDATE_STRING_MSG,
  VALIDATE_URL_MSG,
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

    body('honorific')
      .if(body('honorific').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('level')
      .if(body('level').notEmpty())
      .isIn(Object.values(CustomerLevel)).withMessage(`property allow only in ${Object.values(CustomerLevel)}`),

    body('socialLink', VALIDATE_EMAIL_MSG)
      .if(body('socialLink').notEmpty())
      .isEmail(),
  ];
}

export function updateCustomerValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('name').notEmpty())
      .isString(),

    body('honorific')
      .if(body('honorific').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('birthday', VALIDATE_DATE_MSG)
      .if(body('birthday').notEmpty())
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),

    body('sex')
      .if(body('sex').notEmpty())
      .isIn(Object.values(SexType)).withMessage(`property allow only in ${Object.values(SexType)}`),

    body('maritalStatus')
      .if(body('maritalStatus').notEmpty())
      .isIn(Object.values(MaritalStatus)).withMessage(`property allow only in ${Object.values(MaritalStatus)}`),

    body('primaryPhoneNumber', VALIDATE_PHONE_MSG)
      .if(body('primaryPhoneNumber').notEmpty())
      .custom((value: string) => {
        const regex = /^(0)(\d){9,10}$/;
        return value.match(regex);
      }),

    body('otherPhoneNumbers', VALIDATE_PHONE_ARRAY_MSG)
      .if(body('otherPhoneNumbers').notEmpty())
      .custom((value: Array<string>) => {
        if (!Array.isArray(value)) return false;
        const regex = /^(0)(\d){9,10}$/;
        return value.every((item: string) => item.toString().match(regex));
      }),

    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('email').notEmpty())
      .isEmail(),

    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('tags', VALIDATE_STRING_ARRAY_MSG)
      .if(body('tags').notEmpty())
      .custom((value: Array<string>) => {
        if (!Array.isArray(value)) return false;
        return value.every((item: string) => typeof item === 'string' && item.length > 0);
      }),

    body('sourceId', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('sourceId').notEmpty())
      .isString(),

    body('assigneeId', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('interest', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('interest').notEmpty())
      .isString(),

    body('group', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('group').notEmpty())
      .isString(),

    body('genitive', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('genitive').notEmpty())
      .isString(),

    body('taxCode', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('taxCode').notEmpty())
      .isString(),

    body('level')
      .if(body('level').notEmpty())
      .isIn(Object.values(CustomerLevel)).withMessage(`property allow only in ${Object.values(CustomerLevel)}`),

    body('socialLink', VALIDATE_URL_MSG)
      .if(body('socialLink').notEmpty())
      .isURL(),
  ];
}

export function getCustomerValidator() {
  return [
    param('customerId')
      .notEmpty()
      .isString(),
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

export function getLeadByCustomerValidator() {
  return [
    param('customerId')
      .notEmpty()
      .isString(),
  ];
}

export function getBookingByCustomerValidator() {
  return [
    param('customerId')
      .notEmpty()
      .isString(),
  ];
}
