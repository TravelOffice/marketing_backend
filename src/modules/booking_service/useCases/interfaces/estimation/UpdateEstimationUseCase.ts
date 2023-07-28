import { Estimation } from '../../../models/Estimation';
import { CognitoUser } from '../../../models/CognitoUser';
import { UpdateEstimationDto } from '../../../models/dto/estimation/UpdateEstimationDto';

export interface UpdateEstimationUseCase {
  invoke(
    currentUser: CognitoUser,
    tourId: string,
    estimationId: string,
    updateEstimationDto: UpdateEstimationDto,
  ): Promise<Estimation>,
}
