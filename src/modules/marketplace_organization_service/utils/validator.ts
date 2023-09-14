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

export function createOrganizationValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isString(),
    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .notEmpty()
      .isEmail().withMessage(VALIDATE_EMAIL_MSG),
    body('phoneNumber', VALIDATE_PHONE_MSG)
      .if(body('phoneNumber').notEmpty())
      .custom((value: string) => {
        const regex = /^(?:\+?84|0)(\d){9,10}$/;
        return value.match(regex);
      }),
    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),
    body('profilePicture')
      .if(body('profilePicture').notEmpty())
      .isURL().withMessage('Invalid Profile picture URL'),
    body('employeesCount', VALIDATE_NUMBER_MSG)
      .optional()
      .isNumeric(),
    body('foundedYear', VALIDATE_NUMBER_MSG)
      .optional()
      .isNumeric(),
    body('website', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('website').notEmpty())
      .isURL().withMessage('Invalid Website URL'),
    body('socialMedia.facebook')
      .if(body('socialMedia.facebook').notEmpty())
      .isURL()
      .withMessage('Invalid Facebook URL'),
    body('socialMedia.twitter')
      .if(body('phoneNumber').notEmpty())
      .isURL()
      .withMessage('Invalid Twitter URL'),
    body('socialMedia.zalo')
      .if(body('socialMedia.zalo').notEmpty())
      .isURL()
      .withMessage('Invalid Zalo URL'),
    body('socialMedia.instagram')
      .if(body('socialMedia.instagram').notEmpty())
      .isURL()
      .withMessage('Invalid Instagram URL'),
  ];
}

export function updateOrganizationValidator() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .notEmpty()
      .isString(),
    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .optional()
      .notEmpty()
      .isEmail()
      .withMessage(VALIDATE_EMAIL_MSG),
    body('phoneNumber', VALIDATE_PHONE_MSG)
      .if(body('phoneNumber').notEmpty())
      .custom((value: string) => {
        const regex = /^(?:\+?84|0)(\d){9,10}$/;
        return value.match(regex);
      }),
    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),
    body('profilePicture')
      .if(body('profilePicture').notEmpty())
      .isURL().withMessage('Invalid Profile picture URL'),
    body('employeesCount', VALIDATE_NUMBER_MSG)
      .optional()
      .isNumeric(),
    body('foundedYear', VALIDATE_NUMBER_MSG)
      .optional()
      .isNumeric(),
    body('website', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('website').notEmpty())
      .isURL().withMessage('Invalid Website URL'),
    body('socialMedia.facebook')
      .if(body('socialMedia.facebook').notEmpty())
      .isURL()
      .withMessage('Invalid Facebook URL'),
    body('socialMedia.twitter')
      .if(body('socialMedia.twitter').notEmpty())
      .isURL()
      .withMessage('Invalid Twitter URL'),
    body('socialMedia.zalo')
      .if(body('socialMedia.zalo').notEmpty())
      .isURL()
      .withMessage('Invalid Zalo URL'),
    body('socialMedia.instagram')
      .if(body('socialMedia.instagram').notEmpty())
      .isURL()
      .withMessage('Invalid Instagram URL'),
  ];
}
