import { Request } from 'express';
import {
  body, param, query, ValidationError, validationResult,
} from 'express-validator';
import {
  allowedInitialPostStatuses,
  VALIDATE_BOOLEAN_MSG,
  VALIDATE_DATE_MSG,
  VALIDATE_NUMBER_MSG,
  VALIDATE_POSITIVE_NUMBER_MSG,
  VALIDATE_REQUIRED_MSG,
  VALIDATE_STRING_MSG,
  VALIDATE_URL_MSG,
} from './constants';
import { tourPostTypes } from '../models/TourPostType';
import { linkedLeadOrTourTemplateTypes } from '../models/LinkedLeadOrTourInfo';
import { TourPostStatus } from '../models/TourPostStatus';

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

export function getTourPostValidator() {
  return [
    param('id').notEmpty().withMessage('id is required'),
  ];
}

export function createTourPostValidator() {
  return [
    body('name')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('linkedToTargetCode') // Lead or TourTemplate code
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('linkedToTargetType') // LEAD or TOUR_TEMPLATE
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isIn(linkedLeadOrTourTemplateTypes)
      .withMessage(`allow only in ${linkedLeadOrTourTemplateTypes}`),

    body('description')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('thumbnail')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isURL()
      .withMessage(VALIDATE_URL_MSG),

    body('type')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isIn(tourPostTypes)
      .withMessage(`allow only in ${tourPostTypes}`),

    body('pricePerPax')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isNumeric()
      .withMessage(VALIDATE_NUMBER_MSG),

    body('commission')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isInt({ min: 0 })
      .withMessage(VALIDATE_POSITIVE_NUMBER_MSG),

    body('expiry')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('autoClose')
      .optional()
      .isBoolean()
      .withMessage(VALIDATE_BOOLEAN_MSG),

    body('maximumPaxToTrade')
      .optional()
      .isInt({ min: 0 })
      .withMessage(VALIDATE_POSITIVE_NUMBER_MSG),

    body('endingLocation')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('departureDate')
      .notEmpty()
      .withMessage(VALIDATE_REQUIRED_MSG)
      .custom((value) => !Number.isNaN(new Date(value)))
      .withMessage(VALIDATE_DATE_MSG),
  ];
}

export function updateTourPostValidator() {
  return [
    param('id').notEmpty().withMessage(VALIDATE_REQUIRED_MSG),

    body('name')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('description')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('thumbnail')
      .optional()
      .isURL()
      .withMessage(VALIDATE_URL_MSG),

    body('type')
      .optional()
      .isIn(tourPostTypes)
      .withMessage(`allow only in ${tourPostTypes}`),

    body('pricePerPax')
      .optional()
      .isInt({ min: 0 })
      .withMessage(VALIDATE_POSITIVE_NUMBER_MSG),

    body('commission')
      .optional()
      .isInt({ min: 0 })
      .withMessage(VALIDATE_POSITIVE_NUMBER_MSG),

    body('expiry')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('autoClose')
      .optional()
      .isBoolean()
      .withMessage(VALIDATE_BOOLEAN_MSG),

    body('maximumPaxToTrade')
      .optional()
      .isInt({ min: 0 })
      .withMessage(VALIDATE_POSITIVE_NUMBER_MSG),

    body('status')
      .optional()
      .isIn(allowedInitialPostStatuses)
      .withMessage(`allow only in ${allowedInitialPostStatuses}`),

    body('endingLocation')
      .optional()
      .isString()
      .withMessage(VALIDATE_STRING_MSG),

    body('departureDate')
      .optional()
      .custom((value) => !Number.isNaN(new Date(value)))
      .withMessage(VALIDATE_DATE_MSG),
  ];
}

export function getSelfPostsValidator() {
  return [
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
    query('limit').optional().isInt().withMessage('must be a number'),
    query('sortType')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('property must be one of ASC, DESC'),
    query('status')
      .optional()
      .isIn(Object.values(TourPostStatus))
      .withMessage(`allow only in ${Object.values(TourPostStatus)}`),
  ];
}

export function getPostsValidator() {
  return [
    query('organization')
      .optional().isString().notEmpty()
      .withMessage('must be a string'),
    query('author')
      .optional().isString().notEmpty()
      .withMessage('must be a string'),
    query('postType')
      .optional().isIn(tourPostTypes)
      .withMessage(`allow only in ${tourPostTypes}`),
    query('endingLocation')
      .optional().isString().notEmpty()
      .withMessage('must be a string'),
    query('departureDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }).withMessage('must be a date string'),
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
    query('limit').optional().isInt().withMessage('must be a number'),
    query('sortType')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('property must be one of ASC, DESC'),
    query('status')
      .optional()
      .isIn(Object.values(TourPostStatus))
      .withMessage(`allow only in ${Object.values(TourPostStatus)}`),
  ];
}

export function getBookmarkedOrFollowedPostsValidator() {
  return [
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
    query('limit').optional().isInt().withMessage('must be a number'),
    query('sortType')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('property must be one of ASC, DESC'),
  ];
}

export function idParamValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
  ];
}

export function bookmarkPostValidator() {
  return idParamValidator();
}

export function followPostValidator() {
  return idParamValidator();
}

export function getTopTrendingTourValidator() {
  return [
    query('topCount').optional()
      .isInt({ min: 1 })
      .withMessage('must be a number and larger than 0'),
  ];
}
