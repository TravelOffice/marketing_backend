import { Organization } from '../../models/Organization';

export interface OrganizationRepository {
  list(): Promise<Array<Organization>>,
  create(tenantId: string, organization: Organization): Promise<Organization>,
  get(tenantId: string): Promise<Organization | undefined>,
  update(tenantId: string, organization: Partial<Organization>): Promise<Organization>,
  delete(tenantId: string): Promise<void>,
}
