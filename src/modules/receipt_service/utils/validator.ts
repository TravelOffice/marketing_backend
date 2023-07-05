import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import { VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG } from './constants';
import { ReceiptStatus } from '../models/Receipt';

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

export function createReceiptValidator() {
  return [
    body('paymentMethod', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('amount', VALIDATE_NUMBER_MSG)
      .isNumeric(),
    body('description', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('note').exists())
      .isString()
      .notEmpty(),
  ];
}

export function updateReceiptValidator() {
  return [
    body('paymentMethod', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('amount', VALIDATE_NUMBER_MSG)
      .isNumeric(),
    body('description', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .notEmpty(),
    body('status')
      .isIn(Object.values(ReceiptStatus)).withMessage(`property allow only in ${Object.values(ReceiptStatus)}`),
  ];
}
