import { CognitoUser } from '../../../models/CognitoUser';

export interface DeleteEstimationUseCase {
  invoke(
    currentUser: CognitoUser,
    tourId: string,
    estimationId: string
  ): Promise<void>,
}
