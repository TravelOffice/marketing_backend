import { AttributeValues } from 'core';
import { AutoAssignResponsePayload } from '../../models/AutoAssignResponsePayload';
import { ConversationQueryParams } from '../../models/ConversationQueryParams';

export interface AutoAssignChatUseCase {
  invoke: (
    conversation: ConversationQueryParams,
    marshalledSales: AttributeValues[],
  ) => Promise<AutoAssignResponsePayload>
}
