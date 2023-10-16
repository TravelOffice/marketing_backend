import { BaseDdbModel } from 'common-models';

export interface ConversationStatistic extends BaseDdbModel {
  // pk: TN#<tenantId>#CS
  // sk: conversationId
  // lsi1: chatPlatform
  // lsi2: pageId
}
