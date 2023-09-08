import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { GetTourPostListByPostTypeUseCase } from './interfaces/GetTourPostListByPostTypeUseCase';
import { TourPostType } from '../models/TourPostType';

export default class GetTourPostListByPostTypeUseCaseImpl
implements GetTourPostListByPostTypeUseCase {
  invoke = async (
    currentUser: CognitoUser,
    postType: TourPostType,
    params: PaginationParams,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;

    return tourPostRepository.listByPostType(currentUserId, postType, params);
  };
}
