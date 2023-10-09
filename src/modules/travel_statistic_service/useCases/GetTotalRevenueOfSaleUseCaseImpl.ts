import { saleStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';
import { TotalRevenueMetricResponse } from '../models/DepartureTourStatistic';
import { GetTotalRevenueOfSaleUseCase } from './interfaces/GetTotalRevenueOfSaleUseCase';

export default class GetTotalRevenueOfSaleUseCaseImpl implements GetTotalRevenueOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<TotalRevenueMetricResponse> => {
    const records = await saleStatisticRepository.getBookingStatistic(
      tenant,
      saleId,
      filteringDuration,
    );
    const totalRevenue = records.reduce((a, b) => a + b.ttP, 0);
    return {
      totalRevenue,
    };
  };
}
