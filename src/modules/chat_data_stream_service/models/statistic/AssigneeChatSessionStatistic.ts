import { BaseDdbModel } from 'common-models';

export interface AssigneeChatSessionStatistic extends BaseDdbModel {
  // pk: TN#<tenantId>#<assigneeId>#ACS
  // sk: conversationId#sessionId
  // lsi1: startTime
  // lsi2: duration (in milliseconds)
  // lsi3: status // filter by status
  // lsi4: responseTime // filter by responseTime
}
