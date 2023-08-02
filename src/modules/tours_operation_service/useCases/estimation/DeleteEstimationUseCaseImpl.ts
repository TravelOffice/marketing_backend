import { CognitoUser } from '../../models/CognitoUser';
import { estimationRepository } from '../../repositories';
import { DeleteEstimationUseCase } from '../../repositories/interfaces/estimation/DeleteEstimationUseCase';

export default class DeleteEstimationUseCaseImpl implements DeleteEstimationUseCase {
  /**
   * Invokes the DeleteEstimationUseCase to delete an estimation.
   *
   * @param currentUser - The current user invoking the use case.
   * @param tourId - The ID of the tour operation
   * @param estimationId - The ID of the estimation to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  invoke(currentUser: CognitoUser, tourId: string, estimationId: string): Promise<void> {
    return estimationRepository.delete(currentUser.tenant, tourId, estimationId);
  }
}
