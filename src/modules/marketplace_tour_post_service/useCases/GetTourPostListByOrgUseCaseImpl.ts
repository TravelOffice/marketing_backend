import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { tourPostRepository } from '../repositories';
import { GetTourPostListByOrgUseCase } from './interfaces/GetTourPostListByOrgUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class GetTourPostListByOrgUseCaseImpl implements GetTourPostListByOrgUseCase {
  invoke = async (currentUser: CognitoUser, organization: string, params: PaginationParams) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.listByOrganization(currentUserId, organization, params);
  };
}
