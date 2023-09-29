import { CognitoUser } from '../../models/CognitoUser';
import { UserDeviceSession } from '../../models/UserDeviceSession';
import { CreateUserDeviceSessionDto } from '../../models/dto/CreateUserDeviceSessionDto';

export interface StoreUserSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    createSessionDto: CreateUserDeviceSessionDto,
  ): Promise<UserDeviceSession>,
}
