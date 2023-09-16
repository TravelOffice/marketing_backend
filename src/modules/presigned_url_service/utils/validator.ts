import { Request } from 'express';
import { query, ValidationError, validationResult } from 'express-validator';
import { presignedUrlTypes } from '../models';

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
  return [
    query('pageId', 'is required').not().isEmpty(),
    query('customerId', 'is required').not().isEmpty(),
    query('fileType', 'is required').not().isEmpty(),
  ];
}

export function getPresignedUrlsValidator() {
  return [
    query('presignedUrlType').isIn(presignedUrlTypes).withMessage(`allow only in ${presignedUrlTypes}`),
    query('fileName', 'is required').notEmpty(),
    query('fileType', 'is required').notEmpty(),
  ];
}

export function getAvatarPresignedUrlValidator() {
  return [
    query('fileName', 'is required').not().isEmpty(),
    query('fileType', 'is required').not().isEmpty(),
  ];
}

export function getPaymentVoucherPresignedUrlValidator() {
  return [
    query('fileName', 'is required').not().isEmpty(),
    query('fileType', 'is required').not().isEmpty(),
  ];
}

export function getPassengerAttachedDocPresignedUrlValidator() {
  return [
    query('fileName', 'is required').not().isEmpty(),
    query('fileType', 'is required').not().isEmpty(),
  ];
}
