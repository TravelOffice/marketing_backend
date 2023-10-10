import { BaseDdbModel } from 'common-models';

export interface TourFillingRatioStatistic extends BaseDdbModel {
  // Departure tour name
  // Used to analyze the filling ratio of each departure tour
  dtN?: string,
}
