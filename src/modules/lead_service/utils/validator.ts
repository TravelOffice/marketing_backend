import { Request } from 'express';
import {
  query, body, param, ValidationError, validationResult,
} from 'express-validator';
import {
  LeadType, MaritalStatus, SexType, SourceType, LeadStatus, VocativeType,
} from '../models/Lead';
import {
  VALIDATE_BOOLEAN_MSG, VALIDATE_DATE_MSG,
  VALIDATE_EMAIL_MSG, VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_PHONE_ARRAY_MSG, VALIDATE_PHONE_MSG,
  VALIDATE_STRING_ARRAY_MSG, VALIDATE_STRING_MSG,
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

export function createUpdateLeadValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('name').notEmpty())
      .isString(),

    body('vocative')
      .if(body('vocative').notEmpty())
      .isIn(Object.values(VocativeType)).withMessage(`property allow only in ${Object.values(VocativeType)}`),

    body('birthday', VALIDATE_DATE_MSG)
      .if(body('birthday').notEmpty())
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),

    body('nationality', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('nationality').notEmpty())
      .isString(),

    body('sex')
      .if(body('sex').exists())
      .isIn(Object.values(SexType)).withMessage(`allow only in ${Object.values(SexType)}`),

    body('maritalStatus')
      .if(body('maritalStatus').notEmpty())
      .isIn(Object.values(MaritalStatus)).withMessage(`allow only in ${Object.values(MaritalStatus)}`),

    body('primaryPhoneNumber', VALIDATE_PHONE_MSG)
      .notEmpty()
      .custom((value: string) => {
        const regex = /^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;
        return value.match(regex);
      }),

    body('otherPhoneNumbers', VALIDATE_PHONE_ARRAY_MSG)
      .if(body('otherPhoneNumbers').exists())
      .isArray()
      .custom((value: []) => value.every((phone: string) => {
        const regex = /^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;
        return phone.match(regex);
      })),

    body('email', VALIDATE_EMAIL_MSG)
      .if(body('email').notEmpty())
      .isEmail(),

    body('country', VALIDATE_STRING_MSG)
      .if(body('country').notEmpty())
      .isString(),

    body('province', VALIDATE_STRING_MSG)
      .if(body('province').notEmpty())
      .isString(),

    body('district', VALIDATE_STRING_MSG)
      .if(body('district').notEmpty())
      .isString(),

    body('ward', VALIDATE_STRING_MSG)
      .if(body('ward').notEmpty())
      .isString(),

    body('address', VALIDATE_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('tags', VALIDATE_STRING_ARRAY_MSG)
      .if(body('tags').exists())
      .isArray()
      .custom((value: []) => value.every((tag: string) => tag !== '')),

    body('source')
      .isIn(Object.values(SourceType)).withMessage(`allow only in ${Object.values(SourceType)}`),

    body('enabled', VALIDATE_BOOLEAN_MSG)
      .isBoolean(),

    body('type')
      .isIn(Object.values(LeadType)).withMessage(`allow only in ${Object.values(LeadType)}`),

    body('status')
      .isIn(Object.values(LeadStatus)).withMessage(`allow only in ${Object.values(LeadStatus)}`),
  ];
}

export function getLeadValidator() {
  return [
    param('leadId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
  ];
}

export function getAllLeadByAssigneeValidator() {
  return [
    query('type')
      .notEmpty()
      .isIn(Object.values(LeadType)).withMessage(`allow only in ${Object.values(LeadType)}`),
    query('status')
      .if(query('status').notEmpty())
      .isIn(Object.values(LeadStatus)).withMessage(`allow only in ${Object.values(LeadStatus)}`),
  ];
}
