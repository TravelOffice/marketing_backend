import { Request } from 'express';
import {
  body,
  ValidationError, validationResult,
} from 'express-validator';
import { TourLocationStatus } from '../models/TourLocation';

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
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}, value=${err.value}`).join('; ')}`);
    throw new Error(msgs.join('\n'));
  }
}

export function createUpdateTourLocationValidator() {
  return [
    body('name')
      .notEmpty().withMessage('property must be a non-empty string'),
    body('status')
      .notEmpty().isIn(Object.values(TourLocationStatus)).withMessage(`allow only in ${Object.values(TourLocationStatus)}`),
  ];
}
