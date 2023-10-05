import { OrganizationStats } from '../models/statistic/OrganizationStatistic';
import { TourPostStats } from '../models/statistic/TourPostStatistic';

export function isOrgStatisticChanged(
  orgStatistic: OrganizationStats,
): boolean {
  return Object.values(orgStatistic).some((value) => value > 0);
}

export function isTourPostStatisticChanged(
  tourPostStatistic: TourPostStats,
): boolean {
  const {
    totalOffers, totalRatings, numberOfRatings, isNewPost,
  } = tourPostStatistic;
  return totalOffers > 0 || totalRatings > 0 || numberOfRatings > 0 || isNewPost === true;
}
