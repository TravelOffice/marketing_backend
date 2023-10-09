import { BaseDdbModel } from 'common-models';

export interface TourFillingRatioStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#FR
  // sk = <departureTourId>
  // lsi1 = <filling_ratio>
  dtN: string, // Name of departure tour
}

export interface TourFillingRatioResponse {
  departureTourId: string,
  departureTourName: string,
  fillingRatio: number,
}
