import { BaseDdbModel } from 'common-models';

export interface MarketplaceStatistic extends BaseDdbModel {
  totalOrganizations: number;
  totalPosts: number;
  totalSuccessPosts: number;
  totalOffersMade: number;
}
