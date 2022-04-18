import { Request } from 'express';
import {
  body, param, ValidationError, validationResult
} from 'express-validator';
import { LeadType, SexType, SourceType, StatusType, VocativeType } from '../models/Lead';

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

const commonValidatorSchema = [
  body('name', 'property must be a non-empty string')
    .if(body('name').notEmpty())
    .isString(),

  body('vocative')
    .if(body('vocative').notEmpty())
    .isIn(Object.values(VocativeType)).withMessage(`property allow only in ${Object.values(VocativeType)}`),

  body('birthday', 'property must be match with YYYY-MM-DD')
    .if(body('birthday').notEmpty())
    .custom((value: string) => {
      const date = Date.parse(value);
      return !isNaN(date);
    }),

  body('nationality', 'property must be a non-empty string')
    .if(body('nationality').notEmpty())
    .isString(),

  body('sex')
    .if(body('sex').exists())
    .isIn(Object.values(SexType)).withMessage(`allow only in ${Object.values(SexType)}`),

  body('maritalStatus', 'must be a non-empty string')
    .if(body('maritalStatus').notEmpty())
    .isString(),

  body('primaryPhoneNumber', 'must be non-empty')
    .notEmpty()
    .custom((value: string) => {
      const regex = /^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;
      return value.match(regex);
    }),

  body('otherPhoneNumbers', 'is must be a array of phone numbers')
    .if(body('otherPhoneNumbers').exists())
    .isArray()
    .custom((value: []) => value.every((phone: string) => {
      const regex = /^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;
      return phone.match(regex);
    })),

  body('email', 'must be a valid email address')
    .if(body('email').notEmpty())
    .isEmail(),

  body('country', 'must be a string')
    .if(body('country').notEmpty())
    .isString(),

  body('province', 'must be a string')
    .if(body('province').notEmpty())
    .isString(),

  body('district', 'must be a string')
    .if(body('district').notEmpty())
    .isString(),

  body('ward', 'must be a string')
    .if(body('ward').notEmpty())
    .isString(),

  body('address', 'must be a string')
    .if(body('address').notEmpty())
    .isString(),

  body('tags', 'must be a array of string')
    .if(body('tags').exists())
    .isArray()
    .custom((value: []) => value.every((tag: string) => tag !== '')),

  body('source')
    .isIn(Object.values(SourceType)).withMessage(`allow only in ${Object.values(SourceType)}`),

  body('enabled', 'must be a boolean')
    .isBoolean(),

  body('type')
    .isIn(Object.values(LeadType)).withMessage(`allow only in ${Object.values(LeadType)}`),
];

export function createLeadValidator() {
  return commonValidatorSchema;
}
export function updateLeadValidator() {
  return [
    body('status')
      .if(body('status').notEmpty())
      .isIn(Object.values(StatusType)).withMessage(`allow only in ${Object.values(StatusType)}`),

    body('createdAt', 'must be a non-empty string')
      .notEmpty()
      .isString(),

    body('creatorId', 'must be a non-empty string')
      .notEmpty()
      .isString(),

    body('creatorName', 'must be a non-empty string')
      .notEmpty()
      .isString(),

    ...commonValidatorSchema,
  ];
}

export function getLeadValidator() {
  return [
    param('leadId', 'must be a non-empty string')
      .notEmpty()
      .isString(),
  ]
}
