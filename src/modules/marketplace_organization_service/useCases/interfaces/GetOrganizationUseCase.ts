import { Organization } from '../../models/Organization';

export interface GetOrganizationUseCase {
  invoke(id: string): Promise<Organization | undefined>,
}
