import { helper } from 'core';
import { CognitoUser } from '../../models/CognitoUser';
import { Estimation } from '../../models/Estimation';
import { estimationRepository } from '../../repositories';
import { GetEstimationUseCase } from '../interfaces/estimation/GetEstimationUseCase';

export default class GetEstimationUseCaseImpl implements GetEstimationUseCase {
  /**
   * Invokes the GetEstimationUseCase to delete a estimation.
   *
   * @param currentUser - The current user invoking the use case.
   * @param tourId - The tour operation ID
   * @param estimationId - The ID of the source to retrieve.
   * @returns A Promise that resolves to the retrieved source, or undefined if not found.
   */
  async invoke(
    currentUser: CognitoUser,
    tourId: string,
    estimationId: string,
  ): Promise<Estimation | undefined> {
    const estimation = await estimationRepository.get(
      currentUser.tenant,
      tourId,
      estimationId,
    );
    if (!estimation) return undefined;
    return helper.excludeDataFromObject(estimation) as Estimation;
  }
}
