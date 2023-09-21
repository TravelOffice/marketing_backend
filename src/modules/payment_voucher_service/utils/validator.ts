import { Request } from 'express';
import {
  body, param, ValidationError, validationResult,
} from 'express-validator';
import { VALIDATE_DATE_MSG, VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG } from './constants';
import { paymentVoucherMethods } from '../models/PaymentVoucher';

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
    body('receiverId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('description', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('note').exists())
      .isString()
      .notEmpty(),
    body('tourId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('deadline', VALIDATE_DATE_MSG)
      .if(body('deadline').exists())
      .notEmpty()
      .custom((value) => !Number.isNaN(Date.parse(value))),
    body('method', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty()
      .isIn(paymentVoucherMethods)
      .withMessage(`property allow only in ${Object.values(paymentVoucherMethods)}`),
    body('signGroup', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString()
      .notEmpty(),
    body('attachment', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('attachment').exists())
      .isString()
      .notEmpty(),
  ];
}

export function updatePaymentVoucherValidator() {
  return [
    body('amount')
      .optional()
      .isNumeric()
      .withMessage(VALIDATE_NUMBER_MSG),
    body('receiverId')
      .optional()
      .isNumeric()
      .withMessage(VALIDATE_NUMBER_MSG),
    body('description')
      .optional()
      .isString()
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('note')
      .optional()
      .isString()
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('deadline')
      .optional()
      .custom((value) => !Number.isNaN(Date.parse(value)))
      .withMessage(VALIDATE_DATE_MSG),
    body('method')
      .optional()
      .isString()
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('signGroup')
      .optional()
      .isString()
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('attachment')
      .optional()
      .isString()
      .notEmpty(),
  ];
}

export function approvePaymentVoucherValidator() {
  return [
    param('id').notEmpty().isString().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
  ];
}
