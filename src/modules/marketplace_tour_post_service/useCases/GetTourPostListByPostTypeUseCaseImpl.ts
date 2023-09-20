import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetTourPostListByPostTypeUseCase } from './interfaces/GetTourPostListByPostTypeUseCase';
import { TourPostType } from '../models/TourPostType';
import { TourPostStatus } from '../models/TourPostStatus';

export default class GetTourPostListByPostTypeUseCaseImpl
implements GetTourPostListByPostTypeUseCase {
  invoke = async (
    currentUser: CognitoUser,
    postType: TourPostType,
    params: PaginationParams,
    status?: TourPostStatus,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;

    return tourPostRepository.listByPostType(currentUserId, postType, params, status);
  };
}
