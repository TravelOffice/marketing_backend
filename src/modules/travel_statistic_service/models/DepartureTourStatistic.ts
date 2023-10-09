import { BaseDdbModel } from 'common-models';

export interface DepartureTourStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#DT
  // sk = <departureTourId>
  // lsi1 = <createdAt>
  pf: number, // Profit
  rv: number, // Revenue
  c: number, // Cost
}

export interface TotalRevenueMetricResponse {
  totalRevenue: number,
}

export interface TotalProfitMetricResponse {
  totalProfit: number,
}
