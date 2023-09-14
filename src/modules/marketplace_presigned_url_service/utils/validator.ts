import { Request } from 'express';
import { query, ValidationError, validationResult } from 'express-validator';
import { PresignedUrlTypes } from '../models';

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

export function getPresignedUrlValidator() {
  const presignedUrlTypes = Object.values(PresignedUrlTypes);
  return [
    query('presignedUrlType').isIn(presignedUrlTypes).withMessage(`allow only in ${presignedUrlTypes}`),
    query('fileName', 'is required').notEmpty(),
    query('fileType', 'is required').notEmpty(),
  ];
}
