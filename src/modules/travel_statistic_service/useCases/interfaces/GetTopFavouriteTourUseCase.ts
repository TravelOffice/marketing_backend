import { FilteringDuration } from '../../models/FilteringDuration';
import { FavouriteTour } from '../../models/BookingStatistic';

export interface GetTopFavouriteTourUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringDuration,
    topCount?: number,
  ): Promise<FavouriteTour[]>;
}
