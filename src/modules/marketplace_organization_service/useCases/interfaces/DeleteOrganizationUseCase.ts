import { CognitoUser } from '../../models/CognitoUser';

export interface DeleteOrganizationUseCase {
  invoke(currentUser: CognitoUser, organizationId: string): Promise<void>,
}
