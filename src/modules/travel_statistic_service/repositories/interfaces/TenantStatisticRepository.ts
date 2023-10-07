import { FilteringDuration } from '../../models/FilteringDuration';
import {
  FavouriteLocationStatistic,
  FillingRatioTourStatistic,
  ProficiencyTourStatistic,
} from '../../models/TenantStatistic';

export interface TenantStatisticRepository {

  getTotalRevenue(tenant: string, filteringDuration?: FilteringDuration): Promise<number>;

  getTotalProfit(tenant: string, filteringDuration?: FilteringDuration): Promise<number>;

  getTotalLead(tenant: string, filteringDuration?: FilteringDuration): Promise<number>;

  getTotalBooking(tenant: string, filteringDuration?: FilteringDuration): Promise<number>;

  getProficiencyTours(
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<ProficiencyTourStatistic[]>;

  geFavouriteLocations(
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<FavouriteLocationStatistic[]>;

  getFillingRatioOfTours(tenant: string): Promise<FillingRatioTourStatistic[]>;
}
