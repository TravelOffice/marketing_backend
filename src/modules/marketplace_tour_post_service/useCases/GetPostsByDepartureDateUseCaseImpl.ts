import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { tourPostRepository } from '../repositories';
import { TourPostStatus } from '../models/TourPostStatus';
import { GetPostsByDepartureDateUseCase } from './interfaces/GetPostsByDepartureDateUseCase';

export default class GetPostsByDepartureDateUseCaseImpl implements GetPostsByDepartureDateUseCase {
  invoke = async (
    currentUser: CognitoUser,
    departureDate: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return tourPostRepository.listByDepartureDate(currentUserId, departureDate, params, status);
  };
}
