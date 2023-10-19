import { ChatPlatform } from 'common-models';
import { ChatSession } from '../../models/ChatSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreateSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    platform: ChatPlatform
  ): Promise<ChatSession>,
}
