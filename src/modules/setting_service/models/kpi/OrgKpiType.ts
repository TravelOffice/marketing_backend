export enum OrgKpiMetricEnum {
  // Total revenue kpi
  ORG_KPI_REVENUE = 'ORG_KPI_REVENUE',
  // Total profit api
  ORG_KPI_PROFIT = 'ORG_KPI_PROFIT',
  // Lead growth kpi
  ORG_KPI_L_GROW = 'ORG_KPI_L_GROW',
  // Tour filling ratio kpi
  ORG_KPI_T_FILL = 'ORG_KPI_T_FILL',
  // Target sale by tour kpi
  ORG_KPI_SALE_BY_TOUR = 'ORG_KPI_SALE_BY_TOUR',
}

export type OrgKpiMetric = keyof typeof OrgKpiMetricEnum;

export const orgKpiMetrics = Object.keys(OrgKpiMetricEnum) as OrgKpiMetric[];
