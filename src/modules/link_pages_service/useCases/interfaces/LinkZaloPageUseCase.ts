import { ZaloPage } from 'common-models';
import { CognitoUser } from '../../models/CognitoUser';

export interface LinkZaloPageUseCase {
  invoke: (
    currentUser: CognitoUser,
    authorizationCode: string,
    state: string,
    pageId: string
  ) => Promise<ZaloPage>
}
