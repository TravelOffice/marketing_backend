import { Estimation } from '../../../models/Estimation';
import { CognitoUser } from '../../../models/CognitoUser';

export interface GetEstimationListUseCase {
  invoke(currentUser: CognitoUser, tourId: string): Promise<Estimation[]>,
}
