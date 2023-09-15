import { Organization } from '../../models/Organization';

export interface OrganizationRepository {
  list(): Promise<Array<Organization>>,

  create(id: string, organization: Organization): Promise<Organization>,

  get(id: string): Promise<Organization | undefined>,

  update(id: string, organization: Partial<Organization>): Promise<Organization>,

  delete(id: string): Promise<void>,

  deleteProfilePicture(cdn?: string): Promise<void>;
}
