import { AttributeValues } from 'core';
import { ConversationQueryParams } from './models/ConversationQueryParams';
import { autoAssignChatUseCase } from './useCases';
import { shuffle } from './utils/array';
import logger from './utils/logger';

export interface AutoAssignChatEvent {
  sales: Array<AttributeValues>,
  conversation: ConversationQueryParams,
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AutoAssignChatEvent) => {
  logger.log(`Received event from AWS StepFunctions, payload ${JSON.stringify(event, null, 3)}`);
  const { conversation, sales: marshalledSales } = event;
  // Since sales are get from DynamoDB in same order
  // Array of sales should be suffled to avoid the same sales will be assigned
  // when number of assigned chats is equal
  return autoAssignChatUseCase.invoke(conversation, shuffle(marshalledSales));
};
