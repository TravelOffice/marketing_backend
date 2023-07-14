import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import {
  VALIDATE_BOOLEAN_MSG, VALIDATE_DATE_MSG, VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG,
} from './constants';
import { PaymentVoucherStatus } from '../models/PaymentVoucher';

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

export function createPaymentVoucherValidator() {
  return [
    body('amount', VALIDATE_NUMBER_MSG)
      .isNumeric(),
    body('receiver', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('description', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('note').exists())
      .isString()
      .notEmpty(),
    body('bookingId', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('bookingId').exists())
      .isString()
      .notEmpty(),
    body('deadline', VALIDATE_DATE_MSG)
      .if(body('deadline').exists())
      .notEmpty()
      .custom((value) => !Number.isNaN(Date.parse(value))),
    body('method', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('signGroup', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('includeTax', VALIDATE_BOOLEAN_MSG)
      .isBoolean(),
    body('quickApproval', VALIDATE_BOOLEAN_MSG)
      .isBoolean(),
    body('attachment', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('attachment').exists())
      .isString()
      .notEmpty(),
  ];
}

export function updatePaymentVoucherValidator() {
  return [
    body('amount', VALIDATE_NUMBER_MSG)
      .isNumeric(),
    body('receiver', VALIDATE_NON_EMPTY_STRING_MSG)
      .isNumeric(),
    body('description', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('note').exists())
      .isString()
      .notEmpty(),
    body('bookingId', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('bookingId').exists())
      .isString()
      .notEmpty(),
    body('deadline', VALIDATE_DATE_MSG)
      .if(body('deadline').exists())
      .notEmpty()
      .custom((value) => !Number.isNaN(Date.parse(value))),
    body('method', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('signGroup', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('includeTax', VALIDATE_BOOLEAN_MSG)
      .isBoolean(),
    body('quickApproval', VALIDATE_BOOLEAN_MSG)
      .isBoolean(),
    body('attachment', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('attachment').exists())
      .isString()
      .notEmpty(),
    body('status')
      .isIn(Object.values(PaymentVoucherStatus)).withMessage(`property allow only in ${Object.values(PaymentVoucherStatus)}`),
  ];
}
