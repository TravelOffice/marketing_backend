import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { tourPostRepository } from '../repositories';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class GetTourPostListUseCaseImpl implements GetTourPostListUseCase {
  invoke = async (user: CognitoUser, params: PaginationParams) => {
    const { tenant, username } = user;
    return tourPostRepository.listByUser(`${tenant}#${username}`, params);
  };
}
