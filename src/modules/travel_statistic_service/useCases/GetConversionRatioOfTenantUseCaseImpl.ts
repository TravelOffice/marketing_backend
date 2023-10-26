import { tenantStatisticRepository } from '../repositories';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { GetConversionRatioOfTenantUseCase } from './interfaces/GetConversionRatioOfTenantUseCase';
import { ConversionRatioMetricResponse } from '../models/LeadStatistic';

export default class GetConversionRatioOfTenantUseCaseImpl
implements GetConversionRatioOfTenantUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<ConversionRatioMetricResponse> => {
    let conversionRatio = 0;

    const leadRecords = await tenantStatisticRepository.getLeadStatistic(
      tenant,
      filteringDuration,
    );

    if (leadRecords.length > 0) {
      const bookingRecords = await tenantStatisticRepository.getBookingStatistic(
        tenant,
        filteringDuration,
      );
      conversionRatio = Math.round((bookingRecords.length / leadRecords.length) * 100);
    }

    return {
      conversionRatio,
    };
  };
}
