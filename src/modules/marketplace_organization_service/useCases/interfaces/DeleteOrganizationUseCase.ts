import { CognitoUser } from '../../models/CognitoUser';

export interface DeleteOrganizationUseCase {
  invoke(currentUser: CognitoUser, id: string): Promise<void>,
}
