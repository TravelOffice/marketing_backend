import axios from 'axios';
import { getAwsSecretValue } from 'get-env';
import { AppSyncRepository } from './interfaces/AppSyncRepository';
import {
  receiveMessageQuery,
  ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
  WebhookMessageEvent
} from 'common-models';

export default class AppSyncRepositoryImpl implements AppSyncRepository {
  sendReceivedMessageCommand = async (webhookEvent: WebhookMessageEvent): Promise<ReceiveMessageCommandResponse> => {
    // Get message payload
    const message = webhookEvent.message;

    // Initialize AppSync arguments
    const args: ReceiveMessageCommandArgs = {
      id: message.msg_id,
      sender: webhookEvent.sender.id,
      recipient: webhookEvent.recipient.id,
      customerId: webhookEvent.sender.id,
      timestamp: Number(webhookEvent.timestamp),
      messageData: JSON.stringify({
        text: message.text
      }),
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
