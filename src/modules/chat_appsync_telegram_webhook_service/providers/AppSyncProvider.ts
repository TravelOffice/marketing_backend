import axios from 'axios';
import {
  ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
  receiveMessageQuery,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import logger from '../utils/logger';

export default class AppSyncProvider {
  sendReceivedMessageCommand = async (
    args: ReceiveMessageCommandArgs,
  ): Promise<ReceiveMessageCommandResponse> => {
    // Send command `receivedMessage` to AppSync graphql endpoint
    const endpoint = await getAwsSecretValue('CHAT_APPSYNC_GRAPHQL_ENDPOINT');
    const apiKey = await getAwsSecretValue('CHAT_APPSYNC_API_KEY');
    const response = await axios({
      baseURL: endpoint,
      timeout: 5000,
      headers: {
        'x-api-key': apiKey,
      },
      method: 'POST',
      data: {
        query: receiveMessageQuery,
        variables: args,
        operationName: 'ReceivedMessageMutation',
      },
    });
    logger.log(`[AppSyncProvider.sendReceivedMessageCommand] Fetched mutation data', ${JSON.stringify(response.data, null, 2)}`);

    return response.data;
  };
}
