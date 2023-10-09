import { BaseDdbModel } from 'common-models';

export interface DepartureTourStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#DT
  // sk = <departureTourId>
  // lsi1 = <createdAt>
  pf: number, // Profit
  rv: number, // Revenue
  c: number, // Cost
  dtN: string, // Departure tour name
}

export interface TotalRevenueMetricResponse {
  totalRevenue: number,
}

export interface TotalProfitMetricResponse {
  totalProfit: number,
}

export interface ProficiencyTourResponse {
  departureTourId: string,
  departureTourName: string,
  proficiency: number,
  revenue: number,
  cost: number,
}
