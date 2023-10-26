import { ChatSessionStatistic } from '../../models/ChatSessionStatistic';
import { FilteringTimeRange } from '../../models/FilteringDuration';

export interface TenantChatStatisticRepository {

  getChatSessionStatistic(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<ChatSessionStatistic[]>;
}
