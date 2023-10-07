import { GetTotalLeadOfSaleUseCase } from './interfaces/GetTotalLeadOfSaleUseCase';
import { saleStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';

export default class GetTotalLeadOfSaleUseCaseImpl implements GetTotalLeadOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<number> => saleStatisticRepository.getTotalLead(tenant, saleId, filteringDuration);
}
