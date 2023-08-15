import { Organization } from '../../models/Organization';
import { CognitoUser } from '../../models/CognitoUser';
import { CreateOrganizationDto } from '../../dto/CreateOrganizationDto';

export interface CreateOrganizationUseCase {
  invoke(
    currentUser: CognitoUser,
    createOrganizationDto:
    CreateOrganizationDto
  ): Promise<Organization>,
}
