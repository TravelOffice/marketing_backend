import { helper } from 'core';
import { Organization } from '../models/Organization';
import { UpdateOrganizationUseCase } from './interfaces/UpdateOrganizationUseCase';
import { UpdateOrganizationDto } from '../dto/UpdateOrganizationDto';
import { organizationRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';

export default class UpdateOrganizationUseCaseImpl implements UpdateOrganizationUseCase {
  private allowedUpdatingKeys: (keyof UpdateOrganizationDto)[] = [
    'name',
    'email',
    'phoneNumber',
    'address',
    'profilePicture',
    'employeesCount',
    'foundedYear',
    'website',
    'socialMedia',
  ];

  /**
   * Invokes the UpdateOrganizationUseCase to update a organization.
   *
   * @param currentUser - The current user invoking the use case.
   * @param id - The ID of the organization to update.
   * @param updateOrganizationDto - The DTO (data transfer object) containing the
   * updated organization data.
   * @returns A Promise that resolves to the updated organization.
   * @throws Error if the organization with the specified ID is not found.
   */
  async invoke(
    currentUser: CognitoUser,
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    if (currentUser.tenant !== id) throw new Error('The organization is not associated with the current tenant');
    const currentOrganization = await organizationRepository.get(id);
    if (!currentOrganization) throw new Error(`Could not found organization ${id}`);
    const dataToUpdate = await this.buildDataToUpdate({
      currentOrganization, currentUser, id, updateOrganizationDto,
    });
    const organization = await organizationRepository.update(
      id,
      dataToUpdate,
    );
    return helper.excludeDataFromObject(organization) as Organization;
  }

  /**
   * Builds the data to update based on the provided options.
   *
   * @param options - The options for building the data to update.
   * @returns A Promise that resolves to the partial organization data to update.
   */
  async buildDataToUpdate(options: {
    currentUser: CognitoUser,
    id: string,
    currentOrganization: Organization,
    updateOrganizationDto: UpdateOrganizationDto,
  }): Promise<Partial<Organization>> {
    const { currentOrganization, updateOrganizationDto } = options;
    const now = Date.now();
    let dataToUpdate: Partial<Organization> = {};
    const updateOrganization = helper.extractDataFromObject(
      updateOrganizationDto,
      this.allowedUpdatingKeys,
    );
    const props = Object.keys(updateOrganization);
    props.forEach((key) => {
      const prop = key as keyof UpdateOrganizationDto;
      if (currentOrganization[prop] !== updateOrganizationDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateOrganizationDto[prop] };
      }
    });
    dataToUpdate.updatedAt = now;

    return dataToUpdate;
  }
}
