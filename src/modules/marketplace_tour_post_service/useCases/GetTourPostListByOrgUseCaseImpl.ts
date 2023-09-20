import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetTourPostListByOrgUseCase } from './interfaces/GetTourPostListByOrgUseCase';
import { TourPostStatus } from '../models/TourPostStatus';

export default class GetTourPostListByOrgUseCaseImpl implements GetTourPostListByOrgUseCase {
  invoke = async (
    currentUser: CognitoUser,
    organization: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.listByOrganization(currentUserId, organization, params, status);
  };
}
