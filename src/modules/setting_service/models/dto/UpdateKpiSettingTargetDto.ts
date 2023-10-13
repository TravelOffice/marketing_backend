import { KpiPeriod, OrgKpiMetric } from '../kpi';

export interface UpdateKpiSettingTargetDto {
  kpiValue: number,
  kpiMetric: OrgKpiMetric,
  period: KpiPeriod,
}
