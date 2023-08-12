import { Request } from 'express';
import {
  body, param, ValidationError, validationResult,
} from 'express-validator';
import moment from 'moment';
import { TourPlan, tourPlanActivityTypes } from '../models/tour/TourPlan';
import {
  VALIDATE_INTEGER_MSG, VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG, VALIDATE_VAT_MSG,
} from './constants';
import { serviceTypes } from '../models/Supplier';
import { payerTypes, vatStatuses } from '../models/Estimation';

/**
 * Validate daily plan item
 * @param item Daily plan item to validate
 * @returns Valid or not
 */
function validateDailyPlanItem(item: any) {
  const {
    startTime, endTime, activityType, description, estimationId,
  } = item;
  // Validate startTime, endTime must be date time
  // Start date, end date must be valid and start date must be before end date
  const start = moment(startTime);
  const end = moment(endTime);
  if (!start.isValid() || !end.isValid() || !start.isBefore(end)) {
    return false;
  }

  // Validate estimationId if exists
  if (estimationId) {
    // Check if estimationId is an array
    if (!Array.isArray(estimationId)) return false;
    // Check if estimationId is an array of integer
    return estimationId.every((element) => /^\d+$/.test(element));
  }

  // Activity type must be one of tourPlanActivityTypes
  // Refer detailed types at src\modules\tours_operation\models\tour\TourPlan.ts
  if (!tourPlanActivityTypes.includes(activityType)) {
    return false;
  }
  return description && description.length > 0;
}

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

export function getTourPlanValidator() {
  return [
    param('tourId').notEmpty().withMessage('Departure tour id must not be empty.'),
  ];
}

export function updateTourPlanValidator() {
  return [
    // Validate keys of plan
    // Key must follow format DAY_{number}
    body('tourPlan').custom((data) => Object.keys(data).every((key) => /^(DAY_?)(\d+.*)$/g.test(key))).withMessage('Daily plan key must follow format DAY_{number}.'),
    // Validate daily data of plan
    // Each key value contain daily plan items as an array
    body('tourPlan').custom((data: TourPlan) => Object.values(data).every((dailyPlan) => {
      const isDailyPlanAsArray = Array.isArray(dailyPlan);
      const isDailyPlanItemsValid = dailyPlan.every((item: any) => validateDailyPlanItem(item));
      return isDailyPlanAsArray && isDailyPlanItemsValid;
    })).withMessage('Daily plan is invalid.'),
    param('tourId').notEmpty().withMessage('Departure tour id must not be empty.'),
  ];
}

export function createEstimationValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('supplierId', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('serviceType')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isIn(serviceTypes)
      .withMessage(`property allow only in ${serviceTypes}`),
    body('estimatedPrice', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage(VALIDATE_INTEGER_MSG),
    body('estimatedQuantity', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage(VALIDATE_INTEGER_MSG),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),
    body('vat', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isNumeric()
      .custom(
        (value: number) => value >= 0 && value < 100,
      )
      .withMessage(VALIDATE_VAT_MSG),
    body('vatStatus')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isIn(vatStatuses)
      .withMessage(`property allow only in ${vatStatuses}`),
    body('payer')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isIn(payerTypes)
      .withMessage(`property allow only in ${payerTypes}`),
  ];
}

export function updateEstimationValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('estimatedPrice', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isNumeric(),
    body('estimatedQuantity', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isNumeric(),
    body('note', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),
    body('vat', VALIDATE_NUMBER_MSG)
      .notEmpty()
      .isNumeric(),
    body('vatStatus')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isIn(vatStatuses)
      .withMessage(`property allow only in ${vatStatuses}`),
    body('payer')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isIn(payerTypes)
      .withMessage(`property allow only in ${payerTypes}`),
  ];
}
