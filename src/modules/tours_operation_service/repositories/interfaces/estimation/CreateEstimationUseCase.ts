import { CreateEstimationDto } from '../../../dto/estimation/CreateEstimationDto';
import { CognitoUser } from '../../../models/CognitoUser';
import { Estimation } from '../../../models/Estimation';

export interface CreateEstimationUseCase {
  invoke(
    currentUser: CognitoUser,
    tourId: string,
    createEstimationDto: CreateEstimationDto
  ): Promise<Estimation>,
}
