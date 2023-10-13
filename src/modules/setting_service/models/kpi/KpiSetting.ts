import { BaseDdbModel } from 'common-models';
import { OrgKpiMetric } from './OrgKpiType';
import { KpiPeriodType } from './KpiPeriodType';

export interface KpiSetting extends BaseDdbModel {
  // Start date
  start: number;
  // End date
  end: number;
  // Kpi value
  kv: number;
  // Kpi metric name
  km: OrgKpiMetric;
  // Kpi period type
  kpt: KpiPeriodType;
  // Description
  description?: string;
}
