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
    const tourPostIndex = await tourPostRepository.generateCode();
    const tourPost = {
      ...createTourPostDto,
      code: `${TOUR_POST_ID_PREFIX}${tourPostIndex}`,
      tenant,
      authorId: marketplaceUserId,
      createdAt: now,
      updatedAt: now,
      // Local index with format <tenant>#<username> for getting:
      // - All posts that belong to tenant
      // - All posts that created by specific user
      lsi1: marketplaceUserId,
      lsi2: createTourPostDto.status, // Local index for getting all posts by specific status
    } as TourPost;
    // Add post to DynamoDB
    return tourPostRepository.create(tourPost);
  };
}
