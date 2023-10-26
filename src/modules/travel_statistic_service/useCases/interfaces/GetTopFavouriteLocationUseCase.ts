import { FilteringTimeRange } from '../../models/FilteringDuration';
import { FavouriteLocation } from '../../models/LeadStatistic';

export interface GetTopFavouriteLocationUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
    topCount?: number,
  ): Promise<FavouriteLocation[]>;
}
