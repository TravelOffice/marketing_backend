import { helper } from 'core';
import { TourPost } from '../models/TourPost';
import { marketplaceUserRepository, tourPostRepository } from '../repositories';
import { CreateTourPostUseCase } from './interfaces/CreateTourPostUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreateTourPostDto } from '../dto/CreateTourPostDto';
import { TENANT_INDEX, TOUR_POST_ID_PREFIX } from '../utils/constants';
import { TourPostStatus } from '../models/TourPostStatus';

export default class CreateTourPostUseCaseImpl implements CreateTourPostUseCase {
  allowedCreatingKeys: (keyof CreateTourPostDto)[] = [
    'name',
    'description',
    'thumbnail',
    'type',
    'pricePerPax',
    'commission',
    'expiry',
    'autoClose',
    'maximumPaxToTrade',
    'endingLocation',
    'departureDate',
  ];

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
    const {
      endingLocation, departureDate, type, linkedToTargetCode, linkedToTargetType,
    } = createTourPostDto;

    // Extract data to create
    const allowedCreatingData = helper.extractDataFromObject(
      createTourPostDto,
      this.allowedCreatingKeys,
    );

    const status = TourPostStatus.IN_PROCESS;

    const tourPost = {
      ...allowedCreatingData,
      status: TourPostStatus.IN_PROCESS,
      code: `${TOUR_POST_ID_PREFIX}${tourPostIndex}`,
      organization: tenant,
      authorId: marketplaceUserId,
      linkedToTargetKeys: { pk: `${TENANT_INDEX}#${tenant}#${linkedToTargetType}`, sk: linkedToTargetCode },
      createdAt,
      updatedAt,
      // Local index with format <tenant>#<username> for getting:
      // - All latest posts that belong to tenant
      // - All latest posts that created by specific user
      lsi1: `${marketplaceUserId}#${status}#${createdAt}`, // Local index for getting all posts by specific user
      lsi2: `${tenant}#${status}#${createdAt}`, // Local index for getting all posts by specific organization
      lsi3: `${type}#${status}#${createdAt}`, // Local index for filter tour post by type and status
      lsi4: `${endingLocation}#${status}#${createdAt}`, // Local index for filter latest post by ending location
      lsi5: `${departureDate}#${status}#${createdAt}`, // Local index for filter post by departure date
    } as TourPost;
    // Add post to DynamoDB
    const result = await tourPostRepository.create(tourPost);
    return helper.excludeDataFromObject(result) as TourPost;
  };
}
