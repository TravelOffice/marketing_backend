import { BaseDdbModel } from 'common-models';

export interface DepartureTourStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#DT
  // sk = <createdAt>
  pf: number,
  rv: number,
  c: number,
}

export interface LeadStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#L
  // sk = <createdAt>
  lcId: string, // location ID
  lcN: string, // location name
}

export interface BookingStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#BK
  // sk = <createdAt>
  ttId: string, // tour template ID
  ttN: string, // tour template name
}

export interface FillingRatioStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#FR
  // sk = <filling_ratio>
  id: string, // ID of departure tour
  n: string, // Name of departure tour
}
