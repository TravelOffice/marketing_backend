import { sourceRepository } from '../repositories';
import { DeleteSourceUseCase } from './interfaces/DeleteSourceUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class DeleteSourceUseCaseImpl implements DeleteSourceUseCase {
  /**
   * Invokes the DeleteSourceUseCase to delete a source.
   *
   * @param currentUser - The current user invoking the use case.
   * @param sourceId - The ID of the source to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  invoke(currentUser: CognitoUser, sourceId: string): Promise<void> {
    return sourceRepository.delete(currentUser.tenant, sourceId);
  }
}
