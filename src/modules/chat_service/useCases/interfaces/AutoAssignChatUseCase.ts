import { AutoAssignResponsePayload } from '../../models/AutoAssignResponsePayload';
import { ConversationQueryParams } from '../../models/ConversationQueryParams';
import { AttributeValues } from '../../providers/DynamoProvider';

export interface AutoAssignChatUseCase {
  invoke: (
    conversation: ConversationQueryParams,
    marshalledSales: AttributeValues[],
  ) => Promise<AutoAssignResponsePayload>
}
