import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { tourPostRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
import { GetTourPostListByUserUseCase } from './interfaces/GetTourPostListByUserUseCase';

export default class GetTourPostListByUserUseCaseImpl implements GetTourPostListByUserUseCase {
  invoke = async (
    currentUser: CognitoUser,
    author: string,
    params: PaginationParams,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    // Author and current user are not the same one
    // Another user is viewing the posts of the author
    return tourPostRepository.listByUser(currentUserId, author, params);
  };
}
