import { Request } from 'express';
import { query, ValidationError, validationResult } from 'express-validator';
import { Condition, SessionMetric, SessionStatus } from '../models/ChatSessionStatistic';
import { VALIDATE_DATE_STRING_MSG } from './constants';

function isTimestamp(n: string) {
  const parsed = parseFloat(n);
  return !Number.isNaN(parsed) && Number.isFinite(parsed) && /^\d+\.?\d+$/.test(n);
}

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

export function getSessionStatisticValidator() {
  return [
    query('metricName').notEmpty().withMessage('must be a non-string value').custom((value, { req }) => {
      if (value === SessionMetric.TOTAL) return true;
      if (value === SessionMetric.TOTAL_BY_CONVERSATION && req.query?.conversationId) {
        return true;
      }
      if (value === SessionMetric.TOTAL_BY_STATUS && req.query?.status) {
        return true;
      }
      if (value === SessionMetric.TOTAL_BY_DURATION && req.query?.duration) {
        return true;
      }
      if (value === SessionMetric.AVERAGE_RESPONSE_TIME && req.query?.startTime) {
        return true;
      }
      if (
        value === SessionMetric.TOTAL_RESPONSE_TIME_BY_CONDITION
        && req.query?.comparasionTime
        && req.query?.condition
      ) {
        return true;
      }
      return false;
    })
      .withMessage('missing required param corresponding the metric'),
    query('conversationId').optional().isString().withMessage('must be string'),
    query('status').optional().isIn(Object.values(SessionStatus)).withMessage('must be correct type'),
    query('duration').optional().isString().withMessage('must be string'),
    query('startTime').optional().custom((value) => isTimestamp(value)).withMessage('must be a valid date string'),
    query('comparasionTime').optional().isInt().withMessage('must be integer'),
    query('condition').optional().isIn(Object.values(Condition)).withMessage('must be correct type'),
  ];
}

export function getSessionPlatformStatisticValidator() {
  return [
    query('startTime').notEmpty().custom((value) => isTimestamp(value)).withMessage(VALIDATE_DATE_STRING_MSG),
    query('endTime').notEmpty().custom((value) => isTimestamp(value)).withMessage(VALIDATE_DATE_STRING_MSG),
  ];
}
