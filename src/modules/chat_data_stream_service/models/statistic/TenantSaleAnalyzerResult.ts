import { OrgChatSessionStatistic } from './OrgChatSessionStatistic';
import { ConversationStatistic } from './ConversationStatistic';
import { AssigneeChatSessionStatistic } from './AssigneeChatSessionStatistic';

export type MetricChatAnalyzerResult =
  (
    ConversationStatistic
    | OrgChatSessionStatistic
    | AssigneeChatSessionStatistic
  )
  & { shouldBeDeleted?: boolean };

export type TenantChatAnalyzerResult = MetricChatAnalyzerResult[];
