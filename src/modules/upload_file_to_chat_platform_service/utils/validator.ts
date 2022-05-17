import { Request } from 'express';
import {
  query, ValidationError, validationResult,
} from 'express-validator';
import { SupportedFileType } from './constants';

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => `Validate failed at ${error.location}: ${error.msg} ${error.param}`);
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

export function uploadFileToChaPlatformServiceValidator() {
  return [
    query('fileKey', 'is required').not().isEmpty(),
    query('fileName', 'is required').not().isEmpty(),
    query('fileType', 'is required')
      .not().isEmpty().withMessage('is required')
      .isIn(Object.values(SupportedFileType))
      .withMessage(`allow only in ${Object.values(SupportedFileType)}`),
    query('chatPlatform', 'is required').not().isEmpty(),
    query('pageId', 'is required').not().isEmpty(),
  ];
}
