import { OrganizationStats } from '../models/statistic/OrganizationStatistic';
import { TourPostStats } from '../models/statistic/TourPostStatistic';

export function isOrgStatisticChanged(
  orgStatistic: OrganizationStats,
): boolean {
  const { totalOffers, totalPosts, totalSuccessOffers } = orgStatistic;
  return totalOffers > 0 || totalPosts > 0 || totalSuccessOffers > 0;
}

export function isTourPostStatisticChanged(
  tourPostStatistic: TourPostStats,
): boolean {
  const { totalOffers, totalRatings, numberOfRatings } = tourPostStatistic;
  return totalOffers > 0 || totalRatings > 0 || numberOfRatings > 0;
}
