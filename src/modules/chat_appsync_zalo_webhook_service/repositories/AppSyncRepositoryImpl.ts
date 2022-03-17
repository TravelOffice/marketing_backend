import axios from 'axios';
import {
  AppSyncZaloReceivedMessageData,
  ChatPlatform, ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse, receiveMessageQuery, ZaloWebhookMessageEvent
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { AppSyncRepository } from './interfaces/AppSyncRepository';

export default class AppSyncRepositoryImpl implements AppSyncRepository {
  sendReceivedMessageCommand = async (webhookEvent: ZaloWebhookMessageEvent): Promise<ReceiveMessageCommandResponse> => {
    // Get message payload
    const message = webhookEvent.message;

    // Initialize AppSync arguments
    const messageId = message.msg_id;
    const messageData: AppSyncZaloReceivedMessageData = Object.assign(message, {});
    delete messageData.msg_id; // Delete mid attribute, mid will be appeared in ReceiveMessageCommandArgs
    const args: ReceiveMessageCommandArgs = {
      id: messageId,
      sender: webhookEvent.sender.id,
      recipient: webhookEvent.recipient.id,
      customerId: webhookEvent.sender.id,
      timestamp: Number(webhookEvent.timestamp),
      messageData: JSON.stringify(messageData),
      chatPlatform: ChatPlatform.zalo
    }

    // Send command `receivedMessage` to AppSync graphql endpoint
    const endpoint = await getAwsSecretValue('CHAT_APPSYNC_GRAPHQL_ENDPOINT');
    const apiKey = await getAwsSecretValue('CHAT_APPSYNC_API_KEY');
    const response = await axios({
      baseURL: endpoint,
      timeout: 5000,
      headers: {
        'x-api-key': apiKey
      },
      method: 'POST',
      data: {
        query: receiveMessageQuery,
        variables: args,
        operationName: 'ReceivedMessageMutation',
      },
    });
    console.info('[AppSyncRepositoryImpl.sendReceivedMessageCommand] Fetched mutation data', response.data);

    // TODO: Update cached last message for page in DynamoDB table
    return response.data;
  };
}
