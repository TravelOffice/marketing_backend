import { CognitoUser } from '../../models/CognitoUser';

export interface LinkFacebookPageUseCase {
  invoke: (currentUser: CognitoUser, pageId: string, userAccessToken: string) => Promise<any>
}
