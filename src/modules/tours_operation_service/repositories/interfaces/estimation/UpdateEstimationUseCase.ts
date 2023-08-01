import { Estimation } from '../../../models/Estimation';
import { CognitoUser } from '../../../models/CognitoUser';
import { UpdateEstimationDto } from '../../../dto/estimation/UpdateEstimationDto';

export interface UpdateEstimationUseCase {
  invoke(
    currentUser: CognitoUser,
    tourId: string,
    estimationId: string,
    updateEstimationDto: UpdateEstimationDto,
  ): Promise<Estimation>,
}
