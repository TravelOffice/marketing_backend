import { helper } from 'core';
import { Organization } from '../models/Organization';
import { organizationRepository } from '../repositories';
import { CreateOrganizationUseCase } from './interfaces/CreateOrganizationUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreateOrganizationDto } from '../dto/CreateOrganizationDto';

export default class CreateOrganizationUseCaseImpl implements CreateOrganizationUseCase {
  /**
   * Invokes the CreateOrganizationUseCase to create an organization.
   *
   * @param currentUser - The current user invoking the use case.
   * @param createOrganizationDto - The DTO (data transfer object) containing the data for
   * creating the organization.
   * @returns A Promise that resolves to the created organization.
   */
  async invoke(
    currentUser: CognitoUser,
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const currentOrganization = await organizationRepository.get(currentUser.tenant);
    if (currentOrganization) throw new Error(`Organization ${currentUser.tenant} already existed!`);
    const dataToCreate = await this.buildOrganization({ currentUser, createOrganizationDto });
    const organization = await organizationRepository.create(currentUser.tenant, dataToCreate);
    return helper.excludeDataFromObject(organization) as Organization;
  }

  /**
   * Builds the organization object using the provided options.
   *
   * @param options - The options for building the organization.
   * @returns A Promise that resolves to the built organization.
   */
  private async buildOrganization(options: {
    currentUser: CognitoUser,
    createOrganizationDto: CreateOrganizationDto,
  }): Promise<Organization> {
    const now = Date.now();
    const { currentUser, createOrganizationDto } = options;
    const { tenant, username, name: creatorName } = currentUser;
    const creatorId = `${tenant}#${username}`;
    return {
      ...createOrganizationDto,
      code: tenant,
      createdAt: now,
      updatedAt: now,
      creatorId,
      creatorName,
      lsi1: `${now}`, // createdAt lsi
      lsi2: `${now}`, // updatedAt lsi
      lsi4: `${creatorId}`, // creatorId lsi
    } as Organization;
  }
}
