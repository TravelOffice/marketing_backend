import { Request } from 'express';
import {
  body, query, ValidationError, validationResult,
} from 'express-validator';
import { opportunityPotentials, opportunitySources, opportunityStatuses } from '../models/Opportunity';

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

function validateDate(dateInString: string) {
  const date = Date.parse(dateInString);
  return !Number.isNaN(date);
}

export function updateOpportunityValidator() {
  return [
    body('name').notEmpty().isString(),
    body('source').notEmpty().isIn(opportunitySources).withMessage(`allow only in ${opportunitySources}`),
    body('description').optional().isString(),
    body('status').notEmpty().isIn(opportunityStatuses).withMessage(`allow only in ${opportunityStatuses}`),
    body('closedLostReason').optional().isString(),
    body('estimatedRevenue').optional().isFloat({ min: 0 }),
    body('estimatedConfirmDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('actualCloseDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('assigneeId').notEmpty().isString(),
    body('potential').notEmpty().isIn(opportunityPotentials).withMessage(`allow only in ${opportunityPotentials}`),
    body('notes').optional().isArray().withMessage('notes must be array'),
    body('notes.*.name').if(body('notes').exists()).notEmpty().isString(),
    body('notes.*.description').if(body('notes').exists()).notEmpty().isString(),
    body('tasks').optional().isArray().withMessage('tasks must be array'),
    body('tasks.*.name').if(body('tasks').exists()).notEmpty().isString(),
    body('tasks.*.description').if(body('tasks').exists()).notEmpty().isString(),
  ];
}

export function createOpportunityValidator() {
  return [
    body('name').notEmpty().isString(),
    body('source').notEmpty().isIn(opportunitySources).withMessage(`allow only in ${opportunitySources}`),
    body('description').optional().isString(),
    body('status').notEmpty().isIn(opportunityStatuses).withMessage(`allow only in ${opportunityStatuses}`),
    body('closedLostReason').optional().isString(),
    body('estimatedRevenue').optional().isFloat({ min: 0 }),
    body('estimatedConfirmDate').optional().custom(validateDate),
    body('actualCloseDate').optional().custom(validateDate),
    body('potential').notEmpty().isIn(opportunityPotentials).withMessage(`allow only in ${opportunityPotentials}`),
    body('notes').optional().isArray().withMessage('notes must be array'),
    body('notes.*.name').if(body('notes').exists()).notEmpty().isString(),
    body('notes.*.description').if(body('notes').exists()).notEmpty().isString(),
    body('tasks').optional().isArray().withMessage('tasks must be array'),
    body('tasks.*.name').if(body('tasks').exists()).notEmpty().isString(),
    body('tasks.*.description').if(body('tasks').exists()).notEmpty().isString(),
  ];
}

export function getMyOpportunitiesValidator() {
  return [
    query('status')
      .if(query('status').notEmpty())
      .isIn(opportunityStatuses).withMessage(`allow only in ${opportunityStatuses}`),
  ];
}

export function getOpportunitiesByLeadValidator() {
  return [
    query('status')
      .if(query('status').notEmpty())
      .isIn(opportunityStatuses).withMessage(`allow only in ${opportunityStatuses}`),
  ];
}
