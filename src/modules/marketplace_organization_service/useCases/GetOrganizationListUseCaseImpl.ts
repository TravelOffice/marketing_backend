import { helper } from 'core';
import { organizationRepository } from '../repositories';
import { GetOrganizationListUseCase } from './interfaces/GetOrganizationListUseCase';
import { Organization } from '../models/Organization';

export default class GetOrganizationListUseCaseImpl implements GetOrganizationListUseCase {
  /**
   * Invokes the GetOrganizationListUseCase to get list of organization.
   *
   * @returns A Promise that resolves to an array of organizations.
   */
  async invoke(): Promise<Array<Organization>> {
    const organizations = await organizationRepository.list();
    return organizations.map(
      (organization) => helper.excludeDataFromObject(organization) as Organization,
    );
  }
}
