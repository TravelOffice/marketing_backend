import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { ChatSessionRepository } from './interfaces/ChatSessionRepository';
import { CHAT_SESSION_INDEX, CHAT_SESSION_OPEN_STATUS, TENANT_INDEX } from '../utils/constants';
import { ChatSession, ChatSessionStatus } from '../models';

export default class ChatSessionRepositoryImpl implements ChatSessionRepository {
  getOpenSession = async (tenant: string, conversationId: string) => {
    const chatTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const pk = `${TENANT_INDEX}#${tenant}#${CHAT_SESSION_INDEX}#${conversationId}`;
    const queryParams = {
      TableName: chatTable,
      IndexName: 'Index4',
      KeyConditionExpression: 'pk = :pk and lsi4 = :lsi4_filter',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':lsi1_filter': CHAT_SESSION_OPEN_STATUS,
      },
    };

    const chatItems = await dynamoProvider.query<ChatSession>(queryParams);
    if (chatItems.length === 0) {
      return undefined;
    }
    // There is only one open session for a conversation at a time
    return chatItems[0];
  };

  markSessionActiveIfNeeded = async (chatSession: ChatSession) => {
    const chatTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const {
      pk, sk, assigneeId, startTime, status,
    } = chatSession;
    if (status === ChatSessionStatus.ACTIVE) {
      // Dont update if session is not OPEN
      return;
    }
    // Change session status to ACTIVE
    const newStatus = ChatSessionStatus.ACTIVE;
    // Calculate response time in seconds
    const now = Date.now();
    const responseTime = Math.floor((now - startTime) / 1000);
    const updatingData: Pick<ChatSession, 'lsi3' | 'lsi4' | 'lsi5' | 'responseTime' | 'status'> = {
      responseTime,
      status: newStatus,
      lsi3: `${assigneeId}#${newStatus}`,
      lsi4: newStatus,
      lsi5: responseTime.toString(),
    };
    await dynamoProvider.updateItemWithSetExpression(
      chatTable,
      pk,
      sk,
      updatingData,
    );
  };
}
