import { Organization } from '../../models/Organization';

export interface GetOrganizationUseCase {
  invoke(organizationId: string): Promise<Organization | undefined>,
}
