import { tenantStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';
import { TotalRevenueMetricResponse } from '../models/DepartureTourStatistic';
import { GetTotalRevenueOfTenantUseCase } from './interfaces/GetTotalRevenueOfTenantUseCase';

export default class GetTotalRevenueOfTenantUseCaseImpl implements GetTotalRevenueOfTenantUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringDuration,
  ): Promise<TotalRevenueMetricResponse> => {
    const records = await tenantStatisticRepository.getDepartureTourStatistic(
      tenant,
      filteringDuration,
    );
    const totalRevenue = records.reduce((a, b) => a + b.rv, 0);
    return {
      totalRevenue,
    };
  };
}
