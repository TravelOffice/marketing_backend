import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetFollowedTourPostsUseCase } from './interfaces/GetFollowedTourPostsUseCase';

export default class GetFollowedTourPostsUseCaseImpl implements GetFollowedTourPostsUseCase {
  invoke = async (currentUser: CognitoUser, params: PaginationParams) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.listFollowedByUser(currentUserId, params);
  };
}
