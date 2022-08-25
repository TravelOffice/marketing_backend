import { ConversationQueryParams } from '../models/ConversationQueryParams';
import { DDBUser } from '../models/dynamodb/DDBUser';
import { AttributeValues, dynamoProvider, saleDistributionProvider } from '../providers';
import { chatRepository, userRepository } from '../repositories';
import logger from '../utils/logger';
import { AutoAssignChatUseCase } from './interfaces';

export default class AutoAssignChatUseCaseImpl implements AutoAssignChatUseCase {
  invoke = async (
    conversationQueryParams: ConversationQueryParams,
    marshalledSales: AttributeValues[],
  ) => {
    // Sales data to assign
    const sales = marshalledSales.map((sale) => {
      const saleObj = dynamoProvider.unmarshallValues(sale);
      // Number of assigned chats
      if (saleObj.nacs) {
        saleObj.nacs = 0;
      }
      return saleObj as DDBUser;
    });
    logger.log(`Starting assign conversation ${JSON.stringify(conversationQueryParams, null, 2)} with sales list ${JSON.stringify(sales, null, 2)}`);

    // Pick sale user to assign chat
    const nextAssignedUser = saleDistributionProvider.getAssignedUser(sales);

    // Get conversation from DynamoDB
    const conversation = await chatRepository.getConversation(conversationQueryParams);
    const {
      tenant, pageId, conversationId,
    } = conversationQueryParams;
    if (!conversation) {
      // Return error if conversation is not existed
      throw new Error(`[Tenant ${tenant}] Cannot get conversation [${conversationId}] for page [${pageId}]`);
    }

    // Change assignee for given conversation
    await chatRepository.saveConversationWithNewAssignee(conversation, nextAssignedUser.username);

    // Also, mark employee as waiting response state and increase number of assigned chat
    // Increase number of assigned chats for new assignee
    await userRepository.updateNumberOfAssignedChats(
      nextAssignedUser,
      (nextAssignedUser.nacs || 0) + 1,
      true, // Waiting for chat response flag
    );

    logger.log(`Conversation ${JSON.stringify(conversationQueryParams, null, 2)} has be assigned to employee ${JSON.stringify(nextAssignedUser, null, 2)}`);

    return nextAssignedUser;
  };
}
