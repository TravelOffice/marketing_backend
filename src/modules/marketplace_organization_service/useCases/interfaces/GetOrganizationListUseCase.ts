import { Organization } from '../../models/Organization';

export interface GetOrganizationListUseCase {
  invoke(): Promise<Organization[]>,
}
