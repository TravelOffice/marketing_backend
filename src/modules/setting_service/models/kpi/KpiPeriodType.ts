export enum KpiPeriodTypeEnum {
  W = 'W', // Weekly
  M = 'M', // Monthly
  Q = 'Q', // Quarterly
  Y = 'Y', // Yearly
}

export type KpiPeriodType = keyof typeof KpiPeriodTypeEnum;

export const kpiPeriodTypes = Object.keys(KpiPeriodTypeEnum) as KpiPeriodType[];
