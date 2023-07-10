import { Source } from '../../models/Source';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetSourceUseCase {
  invoke(currentUser: CognitoUser, sourceId: string): Promise<Source|undefined>,
}
