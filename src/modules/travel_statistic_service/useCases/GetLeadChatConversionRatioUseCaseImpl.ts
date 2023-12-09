import { tenantChatStatisticRepository, tenantStatisticRepository } from '../repositories';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { ConversionRatioMetricResponse } from '../models/LeadStatistic';
import { GetLeadChatConversionRatioUseCase } from './interfaces/GetLeadChatConversionRatioUseCase';

export default class GetLeadChatConversionRatioUseCaseImpl
implements GetLeadChatConversionRatioUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<ConversionRatioMetricResponse> => {
    let conversionRatio = 0;

    const leadsFromChat = await tenantStatisticRepository.getLeadCreatedFromChatStatistic(
      tenant,
      filteringDuration,
    );

    if (leadsFromChat.length > 0) {
      const chatSessions = await tenantChatStatisticRepository.getChatSessionStatistic(
        tenant,
        filteringDuration,
      );
      conversionRatio = Math.round((leadsFromChat.length / chatSessions.length) * 100);
    }

    return {
      conversionRatio,
    };
  };
}
