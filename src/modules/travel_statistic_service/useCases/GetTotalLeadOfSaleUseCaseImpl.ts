import { GetTotalLeadOfSaleUseCase } from './interfaces/GetTotalLeadOfSaleUseCase';
import { saleStatisticRepository } from '../repositories';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { TotalLeadMetricResponse } from '../models/LeadStatistic';

export default class GetTotalLeadOfSaleUseCaseImpl implements GetTotalLeadOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringTimeRange,
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
