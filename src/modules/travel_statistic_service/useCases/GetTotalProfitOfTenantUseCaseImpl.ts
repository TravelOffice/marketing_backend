import { tenantStatisticRepository } from '../repositories';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { TotalProfitMetricResponse } from '../models/DepartureTourStatistic';
import { GetTotalProfitOfTenantUseCase } from './interfaces/GetTotalProfitOfTenantUseCase';

export default class GetTotalProfitOfTenantUseCaseImpl implements GetTotalProfitOfTenantUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<TotalProfitMetricResponse> => {
    const records = await tenantStatisticRepository.getDepartureTourStatistic(
      tenant,
      filteringDuration,
    );

    const totalProfit = records.reduce((a, b) => a + b.pf, 0);
    return {
      totalProfit,
    };
  };
}
