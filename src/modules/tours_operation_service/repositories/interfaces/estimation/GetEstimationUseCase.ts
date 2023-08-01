import { Estimation } from '../../../models/Estimation';
import { CognitoUser } from '../../../models/CognitoUser';

export interface GetEstimationUseCase {
  invoke(
    currentUser: CognitoUser,
    tourId: string,
    estimationId: string
  ): Promise<Estimation | undefined>,
}
