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

    body('services').isArray({ min: 1 }).withMessage(VALIDATE_PRICE_ARRAY_MSG),

    body('services.*.name').notEmpty().isString().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('services.*.price').notEmpty().isNumeric().withMessage(VALIDATE_NUMBER_MSG),

    body('policiesAndRegulations', 'Policies and regulations must be an object')
      .isObject(),

    body('policiesAndRegulations.inclusionAndExclusion', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('policiesAndRegulations.inclusionAndExclusion').exists())
      .notEmpty()
      .isString(),

    body('policiesAndRegulations.policyConditionsAndExtraFee', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('policiesAndRegulations.inclusionAndExclusion').exists())
      .notEmpty()
      .isString(),

    body('policiesAndRegulations.cancellationTerms', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('policiesAndRegulations.inclusionAndExclusion').exists())
      .notEmpty()
      .isString(),

    body('tourPlan').notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
  ];
}
