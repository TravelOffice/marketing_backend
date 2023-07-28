import { CognitoUser } from '../../../models/CognitoUser';
import { CreateEstimationDto } from '../../../models/dto/estimation/CreateEstimationDto';
import { Estimation } from '../../../models/Estimation';

export interface CreateEstimationUseCase {
  invoke(
    currentUser: CognitoUser,
    tourId: string,
    createEstimationDto: CreateEstimationDto
  ): Promise<Estimation>,
}
