import { TelegramBot } from 'common-models';
import { CognitoUser } from '../../models/CognitoUser';

export interface LinkTelegramPageUseCase {
  invoke: (currentUser: CognitoUser, token: string) => Promise<Omit<TelegramBot, 'accessToken' | 'secretToken'>>
}
