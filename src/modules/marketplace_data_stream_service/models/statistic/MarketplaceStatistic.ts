import { BaseDdbModel } from 'common-models';

export interface MarketplaceStatistic extends BaseDdbModel {
  totalOrganizations: number;
  totalPosts: number;
  totalOffers: number;
}

export type MarketplaceStats = Pick<MarketplaceStatistic, 'totalOrganizations' | 'totalPosts' | 'totalOffers'>;
