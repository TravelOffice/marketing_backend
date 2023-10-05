import { BaseDdbModel } from 'common-models';

export interface OrganizationStatistic extends BaseDdbModel {
  totalPosts: number;
  totalReceivedOffers: number;
  totalSentOffers: number;
  totalSuccessReceivedOffers: number;
  totalSuccessSentOffers: number;
  totalReceivedOffersRevenue: number;
  totalSentOffersRevenue: number;
}

export type OrganizationStats = Pick<OrganizationStatistic,
  'totalPosts' |
  'totalReceivedOffers' |
  'totalSentOffers' |
  'totalSuccessReceivedOffers' |
  'totalSuccessSentOffers' |
  'totalReceivedOffersRevenue' |
  'totalSentOffersRevenue'>;
