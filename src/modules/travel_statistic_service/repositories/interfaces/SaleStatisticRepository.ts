import { FilteringDuration } from '../../models/FilteringDuration';

export interface SaleStatisticRepository {
  getTotalLead(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<number>;

  getTotalBooking(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<number>;
}
