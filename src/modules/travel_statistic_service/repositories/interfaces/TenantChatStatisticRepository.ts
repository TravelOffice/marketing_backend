import { ChatSessionStatistic } from '../../models/ChatSessionStatistic';
import { FilteringTimeRange } from '../../models/FilteringDuration';
import { ConversationStatistic } from '../../models/ConversationStatistic';

export interface TenantChatStatisticRepository {

  getChatSessionStatistic(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<ChatSessionStatistic[]>;

  getConversationPlatformStatistic(
    tenant: string,
    startTime: string,
    endTime: string,
  ): Promise<Array<ConversationStatistic>>
}
