import { BaseDdbModel } from 'common-models';

export interface OrganizationStatistic extends BaseDdbModel {
  totalPosts: number;
  totalOffers: number;
  totalSuccessOffers: number;
}

export type OrganizationStats = Pick<OrganizationStatistic, 'totalPosts' | 'totalOffers' | 'totalSuccessOffers'>;
