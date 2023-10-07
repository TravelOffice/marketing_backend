import { FilteringDuration } from '../../models/FilteringDuration';

export interface GetTotalBookingOfSaleUseCase {
  invoke(tenant: string, saleId: string, filteringDuration?: FilteringDuration): Promise<number>;
}
