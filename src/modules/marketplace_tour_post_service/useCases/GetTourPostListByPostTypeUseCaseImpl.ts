import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetTourPostListByPostTypeUseCase } from './interfaces/GetTourPostListByPostTypeUseCase';

export default class GetTourPostListByPostTypeUseCaseImpl
implements GetTourPostListByPostTypeUseCase {
  invoke = async (
    currentUser: CognitoUser,
    author: string,
    params: PaginationParams,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;

    return tourPostRepository.listByPostType(currentUserId, author, params);
  };
}
