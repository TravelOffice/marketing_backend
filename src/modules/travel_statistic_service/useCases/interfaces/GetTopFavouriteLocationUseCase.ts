import { FilteringDuration } from '../../models/FilteringDuration';
import { FavouriteLocation } from '../../models/LeadStatistic';

export interface GetTopFavouriteLocationUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringDuration,
    topCount?: number,
  ): Promise<FavouriteLocation[]>;
}
