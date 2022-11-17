import AWS from 'aws';
import { AppSyncEvent } from '../models';
import getSocialPlatformService from '../utils/platformServices';
import { AppSyncHandler } from './AppSyncHandler';

const lambda = new AWS.Lambda();

export default class SocialPlatformHandler implements AppSyncHandler {
  // Handle events for Social platform such as Facebook, Zalo, Telegram
  handle = async (event: AppSyncEvent) => {
    const socialPlatformService = getSocialPlatformService(event);
    const invokeParams: AWS.Lambda.Types.InvocationRequest = {
      FunctionName: socialPlatformService,
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
