import { AppType } from '../../models/UserDeviceSession';

export interface SubscribeToTopicUseCase {
  invoke(
    authorId: string,
    appType: AppType,
    topic: string,
  ): Promise<void>,
}
