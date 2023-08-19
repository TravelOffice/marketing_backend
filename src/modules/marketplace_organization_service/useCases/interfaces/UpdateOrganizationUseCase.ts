import { Organization } from '../../models/Organization';
import { UpdateOrganizationDto } from '../../dto/UpdateOrganizationDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdateOrganizationUseCase {
  invoke(
    currentUser: CognitoUser,
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization>,
}
