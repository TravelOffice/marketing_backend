import { helper } from 'core';
import { PostRating } from '../models/PostRating';
import { marketplaceUserRepository, postRatingRepository, tourPostRepository } from '../repositories';
import { CreatePostRatingUseCase } from './interfaces/CreatePostRatingUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreatePostRatingDto } from '../dto/CreatePostRatingDto';
import { RATING_INDEX } from '../utils/constants';

export default class CreatePostRatingUseCaseImpl implements CreatePostRatingUseCase {
  /**
   * Creates a rating on a tour post by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} tourPostId - The ID of the tour post for which the rating is being created.
   * @param {CreatePostRatingDto} createRatingDto - The data for creating the rating.
   * @returns {Promise<PostRating>} - A promise resolving to the created post rating.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    createRatingDto: CreatePostRatingDto,
  ): Promise<PostRating> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Retrieve the tour post form the repository
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // TODO: Check current user ordered in this post successfully

    // Get the current timestamp
    const now = Date.now();

    // Generate a unique index for the rating
    const ratingIndex = await postRatingRepository.generateCode();
    const createdAt = now;
    const updatedAt = now;

    // Create the rating object
    const postRating = {
      ...createRatingDto,
      code: ratingIndex,
      authorId: marketplaceUserId,
      tourPostId,
      organization: tourPost.organization,
      createdAt,
      updatedAt,
      // Local secondary index with format <tenant>#<username>
      // for getting ratings created by specific user
      lsi1: `${marketplaceUserId}#${createdAt}`,
      lsi2: `${RATING_INDEX}#${createRatingDto.star}#${createdAt}`,
      lsi3: `${createdAt}`,
    } as PostRating;

    // Add the rating to DynamoDB using the repository
    const createdPostRating = await postRatingRepository.create(postRating);
    return helper.excludeDataFromObject(createdPostRating) as PostRating;
  };
}
