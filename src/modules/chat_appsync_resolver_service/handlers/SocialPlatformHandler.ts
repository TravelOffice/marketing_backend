import { InvocationType, lambdaProvider, LogType } from 'core';
import { AppSyncEvent } from '../models';
import getSocialPlatformService from '../utils/platformServices';
import { AppSyncHandler } from './AppSyncHandler';

export default class SocialPlatformHandler implements AppSyncHandler {
  // Handle events for Social platform such as Facebook, Zalo, Telegram
  handle = async (event: AppSyncEvent) => {
    const socialPlatformService = getSocialPlatformService(event);
    const invokeParams = {
      FunctionName: socialPlatformService,
      InvocationType: 'RequestResponse' as InvocationType,
      LogType: 'Tail' as LogType,
      Payload: Buffer.from(JSON.stringify(event)),
    };
    return lambdaProvider.invokeFunction(invokeParams);
  };
}
