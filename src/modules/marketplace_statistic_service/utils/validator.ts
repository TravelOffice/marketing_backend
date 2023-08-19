import { Request } from 'express';
import {
  body, param, query, ValidationError, validationResult,
} from 'express-validator';
import { allowedInitialPostStatuses } from './constants';
// import { tourPostTypes } from '../models/TourPostType';

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => `Validate failed at ${error.location}: ${error.msg} ${error.param}`);
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

export function getOrganizationStatisticValidator() {
  return [
    param('id').notEmpty().withMessage('Id is string value'),
  ];
}
