import { saleStatisticRepository } from '../repositories';
import { FilteringDuration } from '../models/FilteringDuration';
import { ConversionRatioMetricResponse } from '../models/LeadStatistic';
import { GetConversionRatioOfSaleUseCase } from './interfaces/GetConversionRatioOfSaleUseCase';

export default class GetConversionRatioOfSaleUseCaseImpl
implements GetConversionRatioOfSaleUseCase {
  invoke = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<ConversionRatioMetricResponse> => {
    let conversionRatio = 0;

    const leadRecords = await saleStatisticRepository.getLeadStatistic(
      tenant,
      saleId,
      filteringDuration,
    );

    if (leadRecords.length > 0) {
      const bookingRecords = await saleStatisticRepository.getBookingStatistic(
        tenant,
        saleId,
        filteringDuration,
      );
      conversionRatio = Math.round((bookingRecords.length / leadRecords.length) * 100);
    }

    return {
      conversionRatio,
    };
  };
}
