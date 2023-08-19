import { helper } from 'core';
import { organizationRepository } from '../repositories';
import { GetOrganizationUseCase } from './interfaces/GetOrganizationUseCase';
import { Organization } from '../models/Organization';

export default class GetOrganizationUseCaseImpl implements GetOrganizationUseCase {
  /**
   * Invokes the GetOrganizationUseCase to delete a organization.
   *
   * @param id - The ID of the organization to retrieve.
   * @returns A Promise that resolves to the retrieved id, or undefined if not found.
   */
  async invoke(
    id: string,
  ): Promise<Organization | undefined> {
    const organization = await organizationRepository.get(id);
    if (!organization) return undefined;
    return helper.excludeDataFromObject(organization) as Organization;
  }
}
