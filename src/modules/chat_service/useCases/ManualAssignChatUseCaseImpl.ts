import { ConversationQueryParams } from '../models/ConversationQueryParams';
import { chatRepository, userRepository } from '../repositories';
import { PARTITION_KEY_DELIMITER } from '../utils/dynamodbConstants';
import { ManualAssignChatUseCase } from './interfaces/ManualAssignChatUseCase';

export default class ManualAssignChatUseCaseImpl implements ManualAssignChatUseCase {
  /**
   * Assign chat conversation to sale user
   * Flows:
   *  - Check whether conversation is existed in DynamoDB
   *  - Check whether user (employee) is existed in DynamoDB
   *  - Update assignee for given conversation
   * @param conversationQueryParams Contains params for querying conversation item in DynamoDB
   * @param assignee Username who will be assigned to
   */
  invoke = async (conversationQueryParams: ConversationQueryParams, assignee: string) => {
    // Get conversation from DynamoDB
    const conversation = await chatRepository.getConversation(conversationQueryParams);
    const {
      tenant, chatPlatform, pageId, conversationId,
    } = conversationQueryParams;
    if (!conversation) {
      // Return error if conversation is not existed
      throw new Error(`[Tenant ${tenant}] Cannot get conversation [${conversationId}] for page [${pageId}]`);
    }

    // Return conversation immediately if current assignee is same as new assignee
    const [, currentAssignee] = conversation.typeLsi!.split(PARTITION_KEY_DELIMITER);
    if (assignee !== currentAssignee) {
      // Get user to ensure that this user is existed
      const employee = await userRepository.getEmployee(tenant, assignee);
      if (!employee) {
        throw new Error(`[Tenant ${tenant}] User ${assignee} is not existed`);
      }
      // Update assignee for conversation
      await chatRepository.saveConversationWithNewAssignee(conversation, assignee);
    }

    // TODO: Send notification via AppSync endpoint
    // Client should be notified that he/she is assigned new conversation

    const {
      pk, sk, typeLsi, ...restrictedData
    } = conversation;

    return {
      ...restrictedData,
      chatPlatform,
      conversationId,
      pageId,
      assignee,
    };
  };
}
