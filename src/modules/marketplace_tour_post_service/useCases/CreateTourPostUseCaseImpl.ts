import { TourPost } from '../models/TourPost';
import { marketplaceUserRepository, tourPostRepository } from '../repositories';
import { CreateTourPostUseCase } from './interfaces/CreateTourPostUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreateTourPostDto } from '../dto/CreateTourPostDto';
import { TOUR_POST_ID_PREFIX } from '../utils/constants';

export default class CreateTourPostUseCaseImpl implements CreateTourPostUseCase {
  invoke = async (currentUser: CognitoUser, createTourPostDto: CreateTourPostDto) => {
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }
    const now = Date.now();
    const createdAt = now;
    const updatedAt = now;
    const tourPostIndex = await tourPostRepository.generateCode();
    const { status, endingLocation, departureDate } = createTourPostDto;
    const tourPost = {
      ...createTourPostDto,
      code: `${TOUR_POST_ID_PREFIX}${tourPostIndex}`,
      tenant,
      authorId: marketplaceUserId,
      createdAt,
      updatedAt,
      // Local index with format <tenant>#<username> for getting:
      // - All latest posts that belong to tenant
      // - All latest posts that created by specific user
      lsi1: `${marketplaceUserId}#${createdAt}`,
      lsi2: `${status}$${createdAt}`, // Local index for getting all posts by specific status
      lsi3: createdAt.toString(), // Local index for sort post by createdAt
      lsi4: `${endingLocation}#${createdAt}`, // Local index for filter latest post by ending location
      lsi5: departureDate, // Local index for filter post by departure date
    } as TourPost;
    // Add post to DynamoDB
    return tourPostRepository.create(tourPost);
  };
}
