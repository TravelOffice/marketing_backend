import { saleStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';
import { GetTotalBookingOfSaleUseCase } from './interfaces/GetTotalBookingOfSaleUseCase';
import { TotalBookingMetricResponse } from '../models/BookingStatistic';

export default class GetTotalBookingOfSaleUseCaseImpl implements GetTotalBookingOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<TotalBookingMetricResponse> => {
    const records = await saleStatisticRepository.getBookingStatistic(
      tenant,
      saleId,
      filteringDuration,
    );
    return {
      totalBooking: records.length,
    };
  };
}
