import { CognitoUser } from '../../models/User';
import { Lead } from '../../models/Lead';

export interface GetMyLeadListUseCase {
  invoke: (currentUser: CognitoUser) => Promise<Lead[]>,
}
