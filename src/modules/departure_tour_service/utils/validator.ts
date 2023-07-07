import { Request } from 'express';
import moment from 'moment';
import {
  body,
  ValidationError,
  validationResult,
} from 'express-validator';
import {
  VALIDATE_DATE_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_NUMBER_MSG,
  VALIDATE_POSITIVE_NUMBER,
  VALIDATE_PRICE_ARRAY_MSG,
} from './constants';
import { TourType } from '../models/TourType';
import { TourStatus } from '../models/TourStatus';

/**
 * Checks if a date is after or same the current date (considering only the year, month, and day).
 * @param dateValue The timestamp of the date to compare.
 * @returns `true` if the provided date is after the current date, `false` otherwise.
 */
function isDateSameOrAfter(dateValue: number): boolean {
  const currentDate = moment().startOf('day'); // Set time to the start of the day
  const otherDate = moment(dateValue).startOf('day'); // Set time to the start of the day

  return otherDate.isSameOrAfter(currentDate);
}

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorGroups : {[key: string]: ValidationError[]} = {};
    errors.array().forEach((err) => {
      const location = err.location || 'unknown';
      const errs : ValidationError[] = errorGroups[location] || [];
      errs.push(err);
      errorGroups[location] = errs;
    });
    const msgs = Object.entries(errorGroups)
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}`)}`);
    throw new Error(msgs.join('\n'));
  }
}

export function createOrUpdateDepartureTourValidator() {
  return [
    body('name')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('tourTemplate')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('tourTemplateCode')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('type')
      .isIn(Object.values(TourType)).withMessage(`allow only in ${Object.values(TourType)}`),

    body('status')
      .notEmpty().isIn(Object.values(TourStatus)).withMessage(`allow only in ${Object.values(TourStatus)}`),

    body('visitorCount')
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 1 })
      .withMessage(VALIDATE_POSITIVE_NUMBER),

    body('startDate', VALIDATE_DATE_MSG)
      .notEmpty()
      .custom((value) => !Number.isNaN(new Date(value)))
      .custom((value) => isDateSameOrAfter(value))
      .withMessage('Start date must be after the current date'),

    body('startingLocation')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('endingLocation')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('durationInDays', VALIDATE_POSITIVE_NUMBER)
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('durationInNights', VALIDATE_POSITIVE_NUMBER)
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('adultPrice', VALIDATE_POSITIVE_NUMBER)
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('childUnder5Price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('child5to7Price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),

    body('child8to11Price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty().withMessage(VALIDATE_NUMBER_MSG)
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
      .isObject().withMessage('Policies and regulations must be an object')
      .bail()
      .custom((value) => {
        const {
          inclusionAndExclusion,
          policyConditionsAndExtraFee,
          cancellationTerms,
        } = value;

        if (inclusionAndExclusion && typeof inclusionAndExclusion !== 'string') {
          throw new Error('Invalid inclusionAndExclusion');
        }

        if (policyConditionsAndExtraFee && typeof policyConditionsAndExtraFee !== 'string') {
          throw new Error('Invalid policyConditionsAndExtraFee');
        }

        if (cancellationTerms && typeof cancellationTerms !== 'string') {
          throw new Error('Invalid cancellationTerms');
        }

        return true;
      }),

    body('tourPlan')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
  ];
}
