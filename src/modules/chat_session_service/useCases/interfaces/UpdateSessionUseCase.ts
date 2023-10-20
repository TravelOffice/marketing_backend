import { Session } from '../../models/Session';
import { UpdateSessionDto } from '../../dto/UpdateSessionDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdateSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session>,
}
