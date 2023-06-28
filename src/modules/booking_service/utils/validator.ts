import { Request } from 'express';
import {
  body,
  ValidationError,
  validationResult,
} from 'express-validator';
import { tourTypes } from '../models/booking/Booking';
import { VALIDATE_NON_EMPTY_STRING_MSG } from './constants';

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

export function validateNewBookingDataInput() {
  return [
    body('tourTemplateId').notEmpty().isString(),
    body('tourType').notEmpty().isIn(tourTypes).withMessage(`allow only in ${tourTypes}`),
    body('departureDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('assigneeId').notEmpty().isString(),
    body('customer').isObject().withMessage('Customer information must not be empty'),
    body('customer.email').notEmpty().isEmail(),
    body('customer.phone').notEmpty().isMobilePhone('any'),
    body('customer.honorific').optional().isString(),
    body('customer.fullName').optional().isString(),
    body('customer.address').optional().isString(),
  ];
}

export function validateCancelBookingDataInput() {
  return [
    body('reason', VALIDATE_NON_EMPTY_STRING_MSG).notEmpty().isString(),
  ];
}

export function validateGetBookingFilteredParams() {
  // TODO: Implement validator for filtered parameters
  // such as start date, end date, customerId, etc
  return [];
}
