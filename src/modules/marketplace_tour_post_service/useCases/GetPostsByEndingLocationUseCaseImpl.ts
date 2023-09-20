import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { TourPostStatus } from '../models/TourPostStatus';
import { GetPostsByEndingLocationUseCase } from './interfaces/GetPostsByEndingLocationUseCase';

export default class GetPostsByEndingLocationUseCaseImpl
implements GetPostsByEndingLocationUseCase {
  invoke = async (
    currentUser: CognitoUser,
    endingLocation: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.listByEndingLocation(currentUserId, endingLocation, params, status);
  };
}
