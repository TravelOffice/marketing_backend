import { Source } from '../../models/Source';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetSourceListUseCase {
  invoke(currentUser: CognitoUser): Promise<Array<Source>>,
}
