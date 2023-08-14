import { helper } from 'core';
import { marketplaceUserRepository, postRatingRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
import { UpdatePostRatingUseCase } from './interfaces/UpdatePostRatingUseCase';
import { UpdatePostRatingDto } from '../dto/UpdatePostRatingDto';
import { PostRating } from '../models/PostRating';
import { RATING_INDEX } from '../utils/constants';

export default class UpdatePostRatingUseCaseImpl implements UpdatePostRatingUseCase {
  private allowedUpdatingKeys: (keyof UpdatePostRatingDto)[] = [
    'star',
    'description',
  ];

  /**
   * Updates a post rating by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {UpdatePostRatingDto} updateRatingDto - The data for updating the rating.
   * @returns {Promise<PostRating>} - A promise indicating the success of the update.
   */
  invoke = async (
    currentUser: CognitoUser,
    updateRatingDto: UpdatePostRatingDto,
  ): Promise<PostRating> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Extract necessary information from updateRatingDto
    const { code: ratingId, tourPostId, organizationId } = updateRatingDto;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Get the ID of the marketplace user
    const currentUserId = marketplaceUser.id;

    // Retrieve the rating to be updated
    const rating = await postRatingRepository.get(organizationId, tourPostId, ratingId);
    if (!rating) {
      throw new Error('Tour rating not found');
    }

    // Check if the current user is the owner of the rating
    if (rating.authorId !== currentUserId) {
      throw new Error('Only the owner of the post rating can update it');
    }

    // Extract data from the updateRatingDto based on allowed keys
    const allowedUpdatingData = helper.extractDataFromObject(
      updateRatingDto,
      this.allowedUpdatingKeys,
    );

    // Get updated data for the rating
    const updatingRatingData = await this.getDataToUpdate(rating, allowedUpdatingData);

    // Update the rating using the repository
    const updatedPostRating = await postRatingRepository.update(
      organizationId,
      tourPostId,
      ratingId,
      updatingRatingData,
    );
    return helper.excludeDataFromObject(updatedPostRating) as PostRating;
  };

  /**
   * Transform dto to expected data which should be used to update.
   * Also, some kinds of data should be validated before updating.
   * @param rating
   * @param updatingRatingData
   */
  private async getDataToUpdate(
    rating: PostRating,
    updatingRatingData: Partial<UpdatePostRatingDto>,
  ): Promise<Partial<PostRating>> {
    // New data to update
    return {
      ...updatingRatingData,
      lsi2: `${RATING_INDEX}#${updatingRatingData.star}`,
      updatedAt: Date.now(),
    };
  }
}
