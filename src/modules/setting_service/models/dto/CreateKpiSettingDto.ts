import { KpiPeriod, OrgKpiMetric, KpiPeriodType } from '../kpi';

export interface CreateKpiSettingDto {
  kpiValue: number,
  kpiMetric: OrgKpiMetric,
  kpiPeriodType: KpiPeriodType,
  period: KpiPeriod,
  description?: string,
}
