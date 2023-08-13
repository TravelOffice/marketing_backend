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
    body('name').notEmpty().withMessage('name is required'),

    body('description')
      .optional()
      .if(
        body('description').exists(),
      ).isString()
      .withMessage('description must be a string'),

    body('type')
      .notEmpty().withMessage('type is required')
      .isIn(tourPostTypes)
      .withMessage(`allow only in ${tourPostTypes}`),

    body('linkedToTarget').notEmpty().withMessage('linkedLeadOfTenant is required and not be empty'),

    body('expiry').optional()
      .if(body('expiry').exists())
      .isNumeric()
      .withMessage('expiry must be a number'),

    body('autoClose').optional()
      .if(body('autoClose').exists())
      .isBoolean()
      .withMessage('autoClose must be a boolean'),

    body('maximumPaxToTrade').optional()
      .if(body('maximumPaxToTrade').exists())
      .isInt()
      .withMessage('maximumPaxToTrade must be a number'),

    body('status')
      .notEmpty().withMessage('status is required')
      .isIn(allowedInitialPostStatuses)
      .withMessage(`allow only in ${allowedInitialPostStatuses}`),
  ];
}

export function updateTourPostValidator() {
  const validateBody = createTourPostValidator();
  return validateBody.concat(
    [
      param('id').notEmpty().withMessage('id is required'),
    ],
  );
}

export function getSelfPostsValidator() {
  return [
    query('nextToken').if(query('nextToken').exists())
      .isString()
      .notEmpty()
      .withMessage('nextToken must be a string'),
    query('token').if(query('token').exists())
      .isString()
      .withMessage('token must be a string'),
    query('limit').if(query('limit').exists())
      .isInt()
      .withMessage('limit must be a number'),
    query('sortDesc').if(query('sortDesc').exists())
      .isBoolean()
      .withMessage('sortDesc must be a boolean'),
  ];
}

export function getPostsValidator() {
  return [
    query('organization')
      .optional().isString().notEmpty()
      .withMessage('organization must be a string'),
    query('author')
      .optional().isString().notEmpty()
      .withMessage('author must be a string'),

    query('nextToken')
      .optional().isString().notEmpty()
      .withMessage('nextToken must be a string'),
    query('token')
      .optional().isString().notEmpty()
      .withMessage('token must be a string'),
    query('limit').optional().isInt().withMessage('limit must be a number'),
    query('sortDesc').optional()
      .isBoolean()
      .withMessage('sortDesc must be a boolean'),
  ];
}

export function bookmarkPostValidtor() {
  return [
    param('postId').notEmpty().withMessage('postId is required'),
  ];
}

export function followPostValidtor() {
  return [
    param('postId').notEmpty().withMessage('postId is required'),
  ];
}
