import { Request } from 'express';
import {
  body, param, query, ValidationError, validationResult,
} from 'express-validator';
import { VALIDATE_COMMISSION_RATE_MSG, VALIDATE_INTEGER_MSG, VALIDATE_STRING_MSG } from './constants';
import { OfferStatusTypes } from '../models/Offer';

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

export function createOfferValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
    body('description')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),
    body('totalPax')
      .isInt({ min: 1 })
      .withMessage(VALIDATE_INTEGER_MSG),
    body('pricePerPax')
      .isInt({ min: 1 })
      .withMessage(VALIDATE_INTEGER_MSG),
    body('commissionRate')
      .isInt({ min: 0, max: 100 })
      .withMessage(VALIDATE_COMMISSION_RATE_MSG),
  ];
}

export function updateOfferValidator() {
  return [
    param('id').notEmpty().withMessage(' is required'),
    body('description')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),
    body('totalPax')
      .optional()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage(VALIDATE_INTEGER_MSG),
    body('pricePerPax')
      .optional()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage(VALIDATE_INTEGER_MSG),
    body('commissionRate')
      .optional()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage(VALIDATE_INTEGER_MSG),
  ];
}

export function getOfferListOfPostValidator() {
  return [
    param('id')
      .isString()
      .notEmpty()
      .withMessage('Tour post ID must be a string'),
  ];
}

export function getOfferListOfOrgValidator() {
  return [
    query('offerStatus').optional().isIn(OfferStatusTypes).withMessage(`must be one of ${OfferStatusTypes}`),
    query('nextToken')
      .optional()
      .custom((value: string) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      })
      .withMessage('must be a JSON string'),
    query('limit')
      .optional()
      .isInt()
      .withMessage('must be a number'),
    query('sortDesc')
      .optional()
      .isBoolean()
      .withMessage('must be a boolean'),
  ];
}

export function getOfferListOfAuthorValidator() {
  return [
    query('nextToken')
      .optional()
      .custom((value: string) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      })
      .withMessage('nextToken must be a JSON string'),
    query('limit')
      .optional()
      .isInt()
      .withMessage('limit must be a number'),
    query('sortDesc')
      .optional()
      .isBoolean()
      .withMessage('sortDesc must be a boolean'),
  ];
}

export function cancelOfferValidator() {
  return [
    param('id').notEmpty().withMessage('Offer ID is required'),
    body('cancelReason')
      .notEmpty()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),
  ];
}

export function acceptOfferValidator() {
  return [
    param('id').notEmpty().withMessage('Offer ID is required'),
  ];
}

export function rejectOfferValidator() {
  return [
    param('id').notEmpty().withMessage('Offer ID is required'),
    body('rejectReason')
      .notEmpty()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),
  ];
}
