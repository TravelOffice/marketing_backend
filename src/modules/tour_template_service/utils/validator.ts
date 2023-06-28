import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import {
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_NUMBER_MSG,
  VALIDATE_POSITIVE_NUMBER,
  VALIDATE_PRICE_ARRAY_MSG,
} from './constants';
import { TourType } from '../models/TourType';

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

export function createOrUpdateTourTemplateValidator() {
  return [
    body('name').notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('type')
      .isIn(Object.values(TourType))
      .withMessage(`allow only in ${Object.values(TourType)}`),

    body('visitorCount')
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 1 })
      .withMessage(VALIDATE_POSITIVE_NUMBER),

    body('startingLocation')
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('endingLocation')
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('durationInDays', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('durationInNights', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('adultPrice', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('childUnder5Price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('child5to7Price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('child8to11Price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('otherPrice', VALIDATE_PRICE_ARRAY_MSG)
      .if(body('otherPrice').exists())
      .isArray({ min: 1 })
      .custom((value) => {
        if (Array.isArray(value)) {
          // eslint-disable-next-line no-restricted-syntax
          for (const servicePrice of value) {
            if (typeof servicePrice.name !== 'string') {
              throw new Error('Invalid name in service price');
            }
            if (typeof servicePrice.price !== 'number') {
              throw new Error('Invalid price in service price');
            }
          }
          return true;
        }
        throw new Error(VALIDATE_PRICE_ARRAY_MSG);
      }),

    body('policiesAndRegulations')
      .isObject()
      .withMessage('Policies and regulations must be an object')
      .bail()
      .custom((value) => {
        const {
          inclusionAndExclusion,
          policyConditionsAndExtraFee,
          cancellationTerms,
        } = value;

        if (
          inclusionAndExclusion
          && typeof inclusionAndExclusion !== 'string'
        ) {
          throw new Error('Invalid inclusionAndExclusion');
        }

        if (
          policyConditionsAndExtraFee
          && typeof policyConditionsAndExtraFee !== 'string'
        ) {
          throw new Error('Invalid policyConditionsAndExtraFee');
        }

        if (cancellationTerms && typeof cancellationTerms !== 'string') {
          throw new Error('Invalid cancellationTerms');
        }

        return true;
      }),

    body('tourPlan').notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
  ];
}
