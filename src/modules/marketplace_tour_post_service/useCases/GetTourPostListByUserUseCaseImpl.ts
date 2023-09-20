import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetTourPostListByUserUseCase } from './interfaces/GetTourPostListByUserUseCase';
import { TourPostStatus } from '../models/TourPostStatus';

export default class GetTourPostListByUserUseCaseImpl implements GetTourPostListByUserUseCase {
  invoke = async (
    currentUser: CognitoUser,
    author: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    // Author and current user are not the same one
    // Another user is viewing the posts of the author
    return tourPostRepository.listByUser(currentUserId, author, params, status);
  };
}
