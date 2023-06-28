import { Request } from 'express';
import {
  body, param, ValidationError, validationResult,
} from 'express-validator';
import {
  HonorificType,
  LeadStatus,
} from '../models/Lead';
import {
  VALIDATE_DATE_MSG,
  VALIDATE_EMAIL_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG,
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

export function createUpdateLeadValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),

    body('honorific')
      .if(body('honorific').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('phoneNumber', VALIDATE_PHONE_MSG)
      .notEmpty()
      .custom((value: string) => {
        const regex = /^(?:\+?84|0)(\d){9,10}$/;
        return value.match(regex);
      }),

    body('email', VALIDATE_EMAIL_MSG)
      .notEmpty()
      .isEmail(),

    body('address', VALIDATE_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('tourTemplateId', VALIDATE_STRING_MSG)
      .if(body('tourTemplateId').notEmpty())
      .isString(),

    body('desiredTour', VALIDATE_STRING_MSG)
      .if(body('desiredTour').notEmpty())
      .isString(),

    body('description', VALIDATE_STRING_MSG)
      .if(body('description').notEmpty())
      .isString(),

    body('assigneeId', VALIDATE_STRING_MSG)
      .if(body('assigneeId').notEmpty())
      .isString(),

    body('sourceId', VALIDATE_STRING_MSG)
      .notEmpty()
      .isString(),

    body('numberOfAdultPassengers', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isNumeric(),

    body('numberOfChildrenPassengers', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isNumeric(),

    body('departure', VALIDATE_STRING_MSG)
      .notEmpty()
      .isString(),

    body('startDate', VALIDATE_DATE_MSG)
      .notEmpty()
      .custom((value) => !Number.isNaN(Date.parse(value))),

    body('type', VALIDATE_STRING_MSG)
      .notEmpty()
      .isString(),

    body('tourType', VALIDATE_STRING_MSG)
      .if(body('tourType').notEmpty())
      .isString(),
  ];
}

export function updateLeadValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('name').notEmpty())
      .isString(),

    body('honorific')
      .if(body('honorific').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('phoneNumber', VALIDATE_PHONE_MSG)
      .if(body('phoneNumber').notEmpty())
      .custom((value: string) => {
        const regex = /^(?:\+?84|0)(\d){9,10}$/;
        return value.match(regex);
      }),

    body('email', VALIDATE_EMAIL_MSG)
      .if(body('email').notEmpty())
      .isEmail(),

    body('address', VALIDATE_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('tourTemplateId', VALIDATE_STRING_MSG)
      .if(body('tourTemplateId').notEmpty())
      .isString(),

    body('desiredTour', VALIDATE_STRING_MSG)
      .if(body('desiredTour').notEmpty())
      .isString(),

    body('description', VALIDATE_STRING_MSG)
      .if(body('description').notEmpty())
      .isString(),

    body('assigneeId', VALIDATE_STRING_MSG)
      .if(body('assigneeId').notEmpty())
      .isString(),

    body('sourceId', VALIDATE_STRING_MSG)
      .if(body('sourceId').notEmpty())
      .isString(),

    body('numberOfAdultPassengers', VALIDATE_NUMBER_MSG)
      .if(body('numberOfAdultPassengers').notEmpty())
      .isNumeric(),

    body('numberOfChildrenPassengers', VALIDATE_NUMBER_MSG)
      .if(body('numberOfChildrenPassengers').notEmpty())
      .isNumeric(),

    body('departure', VALIDATE_STRING_MSG)
      .if(body('departure').notEmpty())
      .isString(),

    body('startDate', VALIDATE_DATE_MSG)
      .if(body('startDate').notEmpty())
      .custom((value) => !Number.isNaN(Date.parse(value))),

    body('type', VALIDATE_STRING_MSG)
      .if(body('type').notEmpty())
      .isString(),

    body('tourType', VALIDATE_STRING_MSG)
      .if(body('tourType').notEmpty())
      .isString(),
  ];
}

export function getLeadValidator() {
  return [
    param('leadId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
  ];
}

export function changeLeadStatusValidator() {
  return [
    param('leadId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('status')
      .isIn(Object.values(LeadStatus)).withMessage(`property allow only in ${Object.values(LeadStatus)}`),
  ];
}

export function cancelLeadValidator() {
  return [
    body('reason', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
  ];
}

export function changeLeadAssigneeValidator() {
  return [
    param('leadId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('assignee')
      .notEmpty()
      .isString(),
  ];
}
