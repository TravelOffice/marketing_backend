import { GetTotalLeadOfSaleUseCase } from './interfaces/GetTotalLeadOfSaleUseCase';
import { saleStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';
import { TotalLeadMetricResponse } from '../models/LeadStatistic';

export default class GetTotalLeadOfSaleUseCaseImpl implements GetTotalLeadOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<TotalLeadMetricResponse> => {
    const records = await saleStatisticRepository.getLeadStatistic(
      tenant,
      saleId,
      filteringDuration,
    );
    return {
      totalLead: records.length,
    };
  };
}
