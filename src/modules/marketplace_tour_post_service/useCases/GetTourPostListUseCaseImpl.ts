import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';

export default class GetTourPostListUseCaseImpl implements GetTourPostListUseCase {
  invoke = async (currentUser: CognitoUser, params: PaginationParams) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.list(currentUserId, params);
  };
}
