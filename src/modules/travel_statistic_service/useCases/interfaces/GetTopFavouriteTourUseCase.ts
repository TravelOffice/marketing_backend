import { FilteringTimeRange } from '../../models/FilteringDuration';
import { FavouriteTour } from '../../models/BookingStatistic';

export interface GetTopFavouriteTourUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
    topCount?: number,
  ): Promise<FavouriteTour[]>;
}
