import { BaseDdbModel } from 'common-models';

export interface TourPostStatistic extends BaseDdbModel {
  // Total number of offers of the tour post
  totalOffers: number,
  // Total number of ratings of the tour post
  totalRatings: number,
  // Number of users that have rated the tour post
  numberOfRatings: number,
  // The ID of organization
  organization: string,
}

// Lsi1 ís id of lead or tour template that the tour post is linked to
export type TourPostStats = Pick<
  TourPostStatistic,
  'totalOffers' | 'totalRatings' | 'numberOfRatings' | 'organization' | 'lsi1'
>;
