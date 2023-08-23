import { helper } from 'core';
import { PostRating } from '../models/PostRating';
import {
  marketplaceUserRepository, offerRepository, postRatingRepository, tourPostRepository,
} from '../repositories';
import { CreatePostRatingUseCase } from './interfaces/CreatePostRatingUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreatePostRatingDto } from '../dto/CreatePostRatingDto';
import { RATING_INDEX } from '../utils/constants';

export default class CreatePostRatingUseCaseImpl implements CreatePostRatingUseCase {
  /**
   * Create a new post rating for a tour post.
   *
   * @param {CognitoUser} currentUser - The current user.
   * @param {string} tourPostId - The ID of the tour post.
   * @param {CreatePostRatingDto} createRatingDto - Data for creating the post rating.
   * @returns {Promise<PostRating>} - A promise that resolves with the newly created post rating.
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

    // Check if the user has already rated this post
    const existedPostRating = await postRatingRepository.getByUserId(tenant, marketplaceUserId);
    if (existedPostRating) {
      throw new Error('You have already rated this post');
    }

    // Retrieve the tour post from the repository
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) {
      throw new Error('Tour post not found');
    }

    // Retrieve success offers of the author for the tour post
    const successOffers = await offerRepository.listSuccessOfferByPostAndAuthor(
      tourPostId,
      marketplaceUserId,
    );

    if (!successOffers.length) {
      throw new Error("You don't have permission to do this action");
    }

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
