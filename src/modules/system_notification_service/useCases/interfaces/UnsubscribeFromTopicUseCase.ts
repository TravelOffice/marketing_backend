import { AppType } from '../../models/UserDeviceSession';

export interface UnsubscribeFromTopicUseCase {
  invoke(
    authorId: string,
    appType: AppType,
    topic: string,
  ): Promise<void>,
}
