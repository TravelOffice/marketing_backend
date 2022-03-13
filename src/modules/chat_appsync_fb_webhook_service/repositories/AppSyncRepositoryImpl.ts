import axios from 'axios';
import { getAwsSecretValue } from 'get-env';
import { AppSyncRepository } from './interfaces/AppSyncRepository';
import {
  receiveMessageQuery,
  ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
  FacebookWebhookMessageEvent,
  ChatPlatform,
  AppSyncMessageData
} from 'common-models';

export default class AppSyncRepositoryImpl implements AppSyncRepository {
  sendReceivedMessageCommand = async (webhookEvent: FacebookWebhookMessageEvent): Promise<ReceiveMessageCommandResponse> => {
    // Get message payload
    const message = webhookEvent.message;

    // Identify customer id. If is_echo === true => message is sent by Facebook page, otherwise message is sent by customer
    // References https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/message-echoes
    const customerId = message.is_echo ? webhookEvent.recipient.id : webhookEvent.sender.id;

    // Initialize AppSync arguments
    const messageId = message.mid;
    const messageData: AppSyncMessageData = Object.assign(message, {});
    delete messageData.mid; // Delete mid attribute, mid will be appeared in ReceiveMessageCommandArgs
    const args: ReceiveMessageCommandArgs = {
      id: messageId,
      sender: webhookEvent.sender.id,
      recipient: webhookEvent.recipient.id,
      customerId: customerId,
      timestamp: webhookEvent.timestamp,
      messageData: JSON.stringify(messageData),
      platform: ChatPlatform.facebook
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
