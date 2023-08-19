import { organizationRepository } from '../repositories';
import { DeleteOrganizationUseCase } from './interfaces/DeleteOrganizationUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class DeleteOrganizationUseCaseImpl implements DeleteOrganizationUseCase {
  /**
   * Invokes the DeleteOrganizationUseCase to delete a organization.
   *
   * @param currentUser - The current user invoking the use case.
   * @param id - The ID of the organization to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  invoke(currentUser: CognitoUser, id: string): Promise<void> {
    if (currentUser.tenant !== id) throw new Error('The organization is not associated with the current tenant');
    return organizationRepository.delete(id);
  }
}
