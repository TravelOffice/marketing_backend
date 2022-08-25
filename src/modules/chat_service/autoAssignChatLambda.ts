import { ConversationQueryParams } from './models/ConversationQueryParams';
import { AttributeValues } from './providers';
import { autoAssignChatUseCase } from './useCases';
import logger from './utils/logger';

export interface AutoAssignChatEvent {
  sales: Array<AttributeValues>,
  conversation: ConversationQueryParams,
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AutoAssignChatEvent) => {
  logger.log(`Received event from AWS StepFunctions, payload ${JSON.stringify(event, null, 3)}`);
  const { conversation, sales: marshalledSales } = event;
  const assignedSale = await autoAssignChatUseCase.invoke(conversation, marshalledSales);
  return { assignedSale };
};
