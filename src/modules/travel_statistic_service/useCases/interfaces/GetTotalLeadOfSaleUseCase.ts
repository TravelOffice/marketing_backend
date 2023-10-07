import { FilteringDuration } from '../../models/FilteringDuration';

export interface GetTotalLeadOfSaleUseCase {
  invoke(tenant: string, saleId: string, filteringDuration?: FilteringDuration): Promise<number>;
}
