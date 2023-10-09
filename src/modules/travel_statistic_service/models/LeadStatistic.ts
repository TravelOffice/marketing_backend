import { BaseDdbModel } from 'common-models';

export interface LeadStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#L
  // sk = <lead_code>
  // lsi1 = <createdAt>
  // lsi2 = <saleId>#<createdAt>
  lcId: string, // location ID
  lcN: string, // location name
}

export interface TotalLeadMetricResponse {
  totalLead: number,
}

export interface ConversionRatioMetricResponse {
  conversionRatio: number,
}
