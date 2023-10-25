import { ChatPlatform } from 'common-models';
import { AttributeValues, dynamoProvider } from 'core';
import { ChatSession, ChatSessionStatus } from '../models/ChatSession';
import { ConversationQueryParams } from '../models/ConversationQueryParams';
import { DDBUser } from '../models/dynamodb/DDBUser';
import { saleDistributionProvider } from '../providers';
import { chatRepository, chatSessionRepository, userRepository } from '../repositories';
import logger from '../utils/logger';
import { AutoAssignChatUseCase } from './interfaces';

export default class AutoAssignChatUseCaseImpl implements AutoAssignChatUseCase {
  invoke = async (
    conversationQueryParams: ConversationQueryParams,
    marshalledSales: AttributeValues[],
  ) => {
    // Sales data to assign
    const sales = marshalledSales.map((sale) => {
      const saleObj = dynamoProvider.unmarshall(sale);
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
      tenant,
      pageId,
      conversationId,
      chatPlatform,
      lastMessageSentAt = Date.now().toString(),
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

    // Create chat session after assigned sale
    const chatSession = await this.createChatSession({
      tenant,
      conversationId,
      lastMessageSentAt,
      chatPlatform,
      assignedEmployee: nextAssignedUser,
    });

    logger.log(`Chat session for conversation ${JSON.stringify(chatSession, null, 2)} has been created`);

    return {
      assignedSale: nextAssignedUser,
      attachedChatSession: chatSession,
    };
  };

  private createChatSession = async (params: {
    tenant: string,
    conversationId: string,
    lastMessageSentAt: string,
    chatPlatform: ChatPlatform,
    assignedEmployee: DDBUser,
  }) => {
    // Extract information from params
    const {
      tenant,
      conversationId,
      chatPlatform,
      assignedEmployee,
      lastMessageSentAt,
    } = params;
    const { username: assigneeId, firstName, lastName } = assignedEmployee;
    const assigneeName = `${firstName} ${lastName}`;
    const code = await chatSessionRepository.generateChatSessionCode(tenant);

    const createdAt = Date.now();
    const status = ChatSessionStatus.OPEN;
    const chatSession: Omit<ChatSession, 'pk' | 'sk'> = {
      code,
      conversationId,
      assigneeId,
      assigneeName,
      platform: chatPlatform,
      status,
      startTime: parseInt(lastMessageSentAt, 10),
      createdAt,
      updatedAt: createdAt,
      lsi1: createdAt.toString(),
      lsi3: `${assigneeId}#${status}`,
      lsi4: status,
    };

    // TODO: Get creation time from latest message sent by customer

    return chatSessionRepository.create(tenant, conversationId, chatSession);
  };
}
