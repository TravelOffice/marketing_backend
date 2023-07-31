import { helper } from 'core';
import { Estimation } from '../../models/Estimation';
import { CognitoUser } from '../../models/CognitoUser';
import { estimationRepository } from '../../repositories';
import { GetEstimationListUseCase } from '../../repositories/interfaces/estimation/GetEstimationListUseCase';

export default class GetEstimationListUseCaseImpl implements GetEstimationListUseCase {
  /**
   * Invokes the GetEstimationListUseCase to delete a estimation.
   *
   * @param currentUser - The current user invoking the use case.
   * @param tourId - The operation tour ID
   * @returns A Promise that resolves to an array of estimations.
   */
  async invoke(currentUser: CognitoUser, tourId: string): Promise<Array<Estimation>> {
    const estimations = await estimationRepository.list(currentUser.tenant, tourId);
    return estimations.map((estimation) => helper.excludeDataFromObject(estimation) as Estimation);
  }
}
