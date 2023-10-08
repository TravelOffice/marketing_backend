import { saleStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';
import { GetTotalBookingOfSaleUseCase } from './interfaces/GetTotalBookingOfSaleUseCase';

export default class GetTotalBookingOfSaleUseCaseImpl implements GetTotalBookingOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<number> => {
    const records = await saleStatisticRepository.getBookingStatistic(
      tenant,
      saleId,
      filteringDuration,
    );
    return records.length;
  };
}
