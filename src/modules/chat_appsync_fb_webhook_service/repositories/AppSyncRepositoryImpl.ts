import axios from 'axios';
import { AppSyncRepository } from './interfaces/AppSyncRepository';
import { ReceiveMessageCommandArgs, receiveMessageQuery } from '../models';

export default class AppSyncRepositoryImpl implements AppSyncRepository {
  sendReceivedMessageCommand = async (webhookEvent: any): Promise<any> => {
    // Get message payload
    const message = webhookEvent.message;

    // Identify customer id. If is_echo === true => message is sent by Facebook customer, otherwise message is sent by Page
    // References https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/message-echoes
    const customerId = message.is_echo ? webhookEvent.sender.id : webhookEvent.recipient.id;

    // Initialize AppSync arguments
    const args: ReceiveMessageCommandArgs = {
      id: message.mid,
      sender: webhookEvent.sender.id,
      recipient: webhookEvent.recipient.id,
      customerId: customerId,
      timestamp: webhookEvent.timestamp,
      messageData: JSON.stringify({
        text: message.text
      }),
    }

    // Send command `receivedMessage` to AppSync graphql endpoint
    const response = await axios({
      baseURL: 'https://dkpaitkq5fevxoqzgbgp5imjs4.appsync-api.ap-southeast-1.amazonaws.com/graphql', // AppSync endpoint
      timeout: 5000,
      headers: {
        'x-api-key': 'da2-ey3colbavzdydnqazsaaibpske'
      },
      method: 'POST',
      data: {
        query: receiveMessageQuery,
        variables: args,
        operationName: 'ReceivedMessageMutation',
      },
    });
    console.log('Fetched mutation data', response.data);

    // TODO: Update cached last message for page in DynamoDB table
    return response.data;
  };
}
