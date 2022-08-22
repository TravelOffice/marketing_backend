import { ConversationQueryParams } from '../../models/ConversationQueryParams';
import { User } from '../../models/User';
import { AttributeValues } from '../../providers/DynamoProvider';

export interface AutoAssignChatUseCase {
  invoke: (
    conversation: ConversationQueryParams,
    marshalledSales: AttributeValues[],
  ) => Promise<User>
}
