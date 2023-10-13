import { Request } from 'express';
import {
  ValidationError, body, query, validationResult,
} from 'express-validator';
import { kpiPeriodTypes, orgKpiMetrics } from '../models/kpi';
import { VALIDATE_TIMESTAMP_MSG } from './constants';

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

export function getKpiSettingValidator() {
  // Validate request query params with kpiMetric, start, end
  return [
    query('kpiMetric').notEmpty().isIn(orgKpiMetrics).withMessage(`allow only in ${orgKpiMetrics}`),
    query('start', VALIDATE_TIMESTAMP_MSG).custom((value) => !Number.isNaN(new Date(value))),
    query('end', VALIDATE_TIMESTAMP_MSG).custom((value) => !Number.isNaN(new Date(value))),
  ];
}

export function createKpiSettingValidator() {
  return [
    body('kpiValue').isInt().isFloat({ min: 0 }),
    body('kpiPeriodType').notEmpty().isIn(kpiPeriodTypes).withMessage(`allow only in ${kpiPeriodTypes}`),
    body('kpiMetric').notEmpty().isIn(orgKpiMetrics).withMessage(`allow only in ${orgKpiMetrics}`),
    body('description').optional().isString(),
    body('period').notEmpty(),
    body('period.start', VALIDATE_TIMESTAMP_MSG)
      .notEmpty().custom((value) => !Number.isNaN(value) && Number.isFinite(value)),
    body('period.end', VALIDATE_TIMESTAMP_MSG)
      .notEmpty().custom((value) => !Number.isNaN(value) && Number.isFinite(value)),
  ];
}

export function updateKpiTargetValidator() {
  return [
    body('kpiValue').isInt().isFloat({ min: 0 }),
    body('kpiMetric').notEmpty().isIn(orgKpiMetrics).withMessage(`allow only in ${orgKpiMetrics}`),
    body('period').notEmpty(),
    body('period.start', VALIDATE_TIMESTAMP_MSG)
      .notEmpty().custom((value) => !Number.isNaN(value) && Number.isFinite(value)),
    body('period.end', VALIDATE_TIMESTAMP_MSG)
      .notEmpty().custom((value) => !Number.isNaN(value) && Number.isFinite(value)),
  ];
}
