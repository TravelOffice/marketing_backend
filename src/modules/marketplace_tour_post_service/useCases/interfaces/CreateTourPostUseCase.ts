import { TourPost } from '../../models/TourPost';
import { CognitoUser } from '../../models/CognitoUser';
import { CreateTourPostDto } from '../../dto/CreateTourPostDto';

export interface CreateTourPostUseCase {
  invoke(currentUser: CognitoUser, createTourPostDto: CreateTourPostDto): Promise<TourPost>,
}
