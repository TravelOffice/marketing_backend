import { BaseDdbModel } from 'common-models';

export interface ConversationPlatformStatistic {
  name: string;
  data: Array<number>;
  date: Array<string>;
}

export type ConversationPlatformStatisticResponse = {
  data: Array<ConversationPlatformStatistic>;
}

export interface ConversationStatistic extends BaseDdbModel {
  // pk: TN#<tenantId>#CV
  // sk: conversationId
  // lsi1: createdAt
  // lsi2: chatPlatform
  // lsi3: pageId
}
