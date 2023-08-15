import { Request } from 'express';
import {
  body,
  ValidationError, validationResult,
} from 'express-validator';
import {
  VALIDATE_EMAIL_MSG, VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG, VALIDATE_PHONE_MSG,
} from './constants';

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

export function createOrUpdateOrganizationValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isEmail().withMessage(VALIDATE_EMAIL_MSG),
    body('phoneNumber', VALIDATE_PHONE_MSG)
      .optional()
      .custom((value: string) => {
        const regex = /^(?:\+?84|0)(\d){9,10}$/;
        return value.match(regex);
      }),
    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isString(),
    body('profilePicture')
      .optional()
      .isURL().withMessage('Invalid Profile picture URL'),
    body('employeesCount', VALIDATE_NUMBER_MSG)
      .optional()
      .isNumeric(),
    body('foundedYear', VALIDATE_NUMBER_MSG)
      .optional()
      .isNumeric(),
    body('website', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .isURL().withMessage('Invalid Website URL'),
    body('socialMedia.facebook')
      .optional()
      .isURL()
      .withMessage('Invalid Facebook URL'),
    body('socialMedia.twitter')
      .optional()
      .isURL()
      .withMessage('Invalid Twitter URL'),
    body('socialMedia.zalo')
      .optional()
      .isURL()
      .withMessage('Invalid Zalo URL'),
    body('socialMedia.instagram')
      .optional()
      .isURL()
      .withMessage('Invalid Instagram URL'),
  ];
}
