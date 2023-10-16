import { BaseDdbModel } from 'common-models';

export interface OrgChatSessionStatistic extends BaseDdbModel {
  // pk: TN#<tenantId>#OCS
  // sk: conversationId#sessionId
  // lsi1: startTime
  // lsi2: duration (in milliseconds)
  // lsi3: status // filter by status
  // lsi4: responseTime // filter by responseTime
}
