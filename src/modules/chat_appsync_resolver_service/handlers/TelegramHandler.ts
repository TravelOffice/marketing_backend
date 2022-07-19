import AWS from 'aws';
import { AppSyncEvent } from '../models';
import { AppSyncHandler } from './AppSyncHandler';
import { TELEGRAM_SERVICE_NAME } from '../utils/environments';

const lambda = new AWS.Lambda();

export default class TelegramHandler implements AppSyncHandler {
  handle = async (event: AppSyncEvent) => {
    const invokeParams: AWS.Lambda.Types.InvocationRequest = {
      FunctionName: TELEGRAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(event),
    };
    const { Payload: payloadString } = await lambda.invoke(invokeParams).promise();
    if (payloadString && typeof payloadString === 'string') {
      return JSON.parse(payloadString);
    }
    throw new Error('Unable to read payload returned from invocation');
  };
}
