import { AppType } from '../../models/UserDeviceSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface MarkAllNotificationsAsReadUseCase {
  invoke(
    currentUser: CognitoUser,
    appType: AppType,
    markedTime: number,
  ): Promise<void>,
}
