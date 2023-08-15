import { CreateTourPostDto } from '../../dto/CreateTourPostDto';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';

export interface CreateTourPostUseCase {
  invoke(currentUser: CognitoUser, createTourPostDto: CreateTourPostDto): Promise<TourPost>,
}
