import { BaseDdbModel } from 'common-models';

export interface DepartureTourStatistic extends BaseDdbModel {
  // Revenue
  rv?: number,
  // Profit
  pf?: number,
  // Cost
  c?: number,
  // Departure tour name
  dtN?: string,
}
