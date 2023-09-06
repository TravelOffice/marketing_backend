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
