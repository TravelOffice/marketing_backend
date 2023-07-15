import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import {
  VALIDATE_ARRAY_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_NUMBER_MSG,
  VALIDATE_STRING_MSG,
} from './constants';
import { supplierServiceTypes } from '../models/Supplier';

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
    const msgs = Object.entries(errorGroups).map(
      (entry) => `Validate failed at ${entry[0]}: ${entry[1]
        .map((err) => `${err.param} ${err.msg}, value=${err.value}`)
        .join('; ')}`,
    );
    throw new Error(msgs.join('\n'));
  }
}

export function createOrUpdateSupplierValidator() {
  return [
    body('name').notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('brandName').notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('establishmentYear').notEmpty().isNumeric().withMessage(VALIDATE_NUMBER_MSG),
    body('starRating').optional().isNumeric().withMessage(VALIDATE_NUMBER_MSG),
    body('capacity').optional().isNumeric().withMessage(VALIDATE_NUMBER_MSG),
    body('services').notEmpty().isArray().isIn(supplierServiceTypes)
      .withMessage(`must be in types ${supplierServiceTypes}`),
    body('city').optional().isString().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('district').optional().isString().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('address').optional().isString().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('taxId').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('note').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('quotes').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('paymentInfo').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('contacts').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
  ];
}

export function updateSupplierQuoteValidator() {
  return [
    body('quotes').isArray().isLength({ min: 0 })
      .withMessage(VALIDATE_ARRAY_MSG),
    body('quotes.*').optional().isObject().withMessage('must be an array of objects'),
    body('quotes.*.year').optional().isInt({ min: 1900, max: 2100 }).withMessage('must be within the range of 1900-2100'),
    body('quotes.*.price').optional().isInt().withMessage('must be an integer'),
    body('quotes.*.link').optional().isURL().withMessage('must be an url'),
    body('quotes.*.description').optional().isString().withMessage('must be a string'),
  ];
}
