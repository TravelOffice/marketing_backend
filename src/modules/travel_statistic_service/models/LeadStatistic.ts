import { BaseDdbModel } from 'common-models';

export interface LeadStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#L
  // sk = <lead_code>
  // lsi1 = <createdAt>
  // lsi2 = <saleId>#<createdAt>
  // lsi3 = source // CHAT, EMAIL, PHONE, WEBSITE...
  lcId: string, // location ID
  lcN: string, // location name
}

export interface TotalLeadMetricResponse {
  totalLead: number,
}

export interface ConversionRatioMetricResponse {
  conversionRatio: number,
}

export interface FavouriteLocation {
  locationId: string,
  locationName: string,
  numberOfLead: number,
}
