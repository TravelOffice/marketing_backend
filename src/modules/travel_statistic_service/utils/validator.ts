import { Request } from 'express';
import { query, ValidationError, validationResult } from 'express-validator';

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

export function getStatisticValidator() {
  return [
    query('metricName').notEmpty().withMessage('must be a non-string value'),
    query('startTime').optional().custom((value) => !Number.isNaN(new Date(value))).withMessage('must be a valid date string'),
    query('endTime').optional().custom((value) => !Number.isNaN(new Date(value))).withMessage('must be a valid date string'),
    query('topCount').optional().isInt().withMessage('must be a integer'),
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
  ];
}
