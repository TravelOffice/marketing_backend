import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { tourPostRepository } from '../repositories';
import { GetSelfTourPostListByUserUseCase } from './interfaces/GetSelfTourPostListByUserUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class GetSelfTourPostListByUserUseCaseImpl
implements GetSelfTourPostListByUserUseCase {
  invoke = async (currentUser: CognitoUser, params: PaginationParams) => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    // Author and current user are the same one
    return tourPostRepository.listByUser(userId, userId, params);
  };
}
