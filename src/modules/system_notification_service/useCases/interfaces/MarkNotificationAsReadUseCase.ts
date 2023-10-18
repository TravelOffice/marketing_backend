import { AppType } from '../../models/UserDeviceSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface MarkNotificationAsReadUseCase {
  invoke(
    currentUser: CognitoUser,
    appType: AppType,
    notificationId: string,
  ): Promise<void>,
}
