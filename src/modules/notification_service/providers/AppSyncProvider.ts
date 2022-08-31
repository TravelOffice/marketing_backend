import axios from 'axios';
import { getAwsSecretValue } from 'get-env';
import { sendNotificationMutation } from '../models/qgl/sendNotificationMutation';
import logger from '../utils/logger';

export default class AppSyncProvider {
  executeSendNotification = async (
    notificationtype: string,
    data: string,
    timestamp: number,
    tenant?: string,
    username?: string,
  ) => {
    // Args
    const args = {
      tenant,
      username,
      type: notificationtype,
      data,
      timestamp,
    };
    // Send command `sendNotification` to AppSync graphql endpoint
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
        query: sendNotificationMutation,
        variables: args,
        operationName: 'SendNotificationMutation',
      },
    });
    logger.log(`[AppSyncProvider.executeSendNotification] Fetched mutation data', ${JSON.stringify(response.data, null, 2)}`);

    return response.data;
  };
}
