import { Request } from 'express';
import {
  body, param, query, ValidationError, validationResult,
} from 'express-validator';
import { allowedInitialPostStatuses } from './constants';
import { tourPostTypes } from '../models/TourPostType';

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
    body('name').notEmpty().withMessage('is required'),

    body('description')
      .optional()
      .if(
        body('description').exists(),
      ).isString()
      .withMessage('must be a string'),

    body('type')
      .notEmpty().withMessage('is required')
      .isIn(tourPostTypes)
      .withMessage(`allow only in ${tourPostTypes}`),

    body('pricePerPax')
      .notEmpty().withMessage('is required')
      .isNumeric()
      .withMessage('must be a number'),

    body('commission')
      .notEmpty().withMessage('is required')
      .isNumeric()
      .withMessage('must be a number'),

    body('linkedToTargetKeys')
      .isObject()
      .withMessage('is required and must be an object'),

    body('linkedToTargetKeys.pk')
      .notEmpty()
      .isString()
      .withMessage('must be a non-empty string'),

    body('linkedToTargetKeys.sk')
      .notEmpty()
      .isString()
      .withMessage('must be a non-empty string'),

    body('expiry')
      .optional()
      .isNumeric()
      .withMessage('must be a number'),

    body('autoClose')
      .optional()
      .isBoolean()
      .withMessage('must be a boolean'),

    body('maximumPaxToTrade')
      .optional()
      .isInt({ min: -1 })
      .withMessage('must be a number'),

    body('status')
      .notEmpty().withMessage('is required')
      .isIn(allowedInitialPostStatuses)
      .withMessage(`allow only in ${allowedInitialPostStatuses}`),

    body('endingLocation')
      .optional()
      .notEmpty()
      .isString()
      .withMessage('must be a non-empty string'),

    body('departureDate')
      .optional()
      .notEmpty()
      .custom((value) => !Number.isNaN(new Date(value)))
      .withMessage('must be a date'),
  ];
}

export function updateTourPostValidator() {
  const validateBody = createTourPostValidator();
  return validateBody.concat(
    [
      param('id').notEmpty().withMessage('is required'),
    ],
  );
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
    query('sortDesc').optional()
      .isBoolean()
      .withMessage('must be a boolean'),
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
    query('sortDesc').optional()
      .isBoolean()
      .withMessage('must be a boolean'),
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
    query('sortDesc').optional()
      .isBoolean()
      .withMessage('must be a boolean'),
  ];
}

export function bookmarkPostValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
  ];
}

export function followPostValidator() {
  return [
    param('id').notEmpty().withMessage('is required'),
  ];
}

export function getTopTrendingTourValidator() {
  return [
    query('topCount').optional()
      .isInt({ min: 1 })
      .withMessage('must be a number and larger than 0'),
  ];
}
