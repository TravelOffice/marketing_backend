import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetBookmarkedTourPostsUseCase } from './interfaces/GetBookmarkedTourPostsUseCase';

export default class GetBookmarkedTourPostsUseCaseImpl implements GetBookmarkedTourPostsUseCase {
  invoke = async (currentUser: CognitoUser, params: PaginationParams) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.listBookmarkedByUser(currentUserId, params);
  };
}
