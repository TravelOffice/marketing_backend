import { BaseDdbModel } from 'common-models';

export interface OrganizationStatistic extends BaseDdbModel {
  totalPosts: number;
  totalOffers: number;
  totalSuccessOffers: number;
}
