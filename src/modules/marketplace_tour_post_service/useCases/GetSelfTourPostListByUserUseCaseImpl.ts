import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetSelfTourPostListByUserUseCase } from './interfaces/GetSelfTourPostListByUserUseCase';

export default class GetSelfTourPostListByUserUseCaseImpl
implements GetSelfTourPostListByUserUseCase {
  invoke = async (currentUser: CognitoUser, params: PaginationParams) => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    // Author and current user are the same one
    return tourPostRepository.listByUser(userId, userId, params);
  };
}
