import { marketplaceUserRepository, postRatingRepository } from '../repositories';
import { DeletePostRatingUseCase } from './interfaces/DeletePostRatingUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class DeletePostRatingUseCaseImpl implements DeletePostRatingUseCase {
  /**
   * Deletes a post rating by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} organizationId - The ID of organization.
   * @param {string} tourPostId - The ID of the tour post associated with the rating.
   * @param {string} postRatingId - The ID of the rating to be deleted.
   * @returns {Promise<void>} - A promise indicating the success of the deletion.
   */
  invoke = async (
    currentUser: CognitoUser,
    organizationId: string,
    tourPostId: string,
    postRatingId: string,
  ): Promise<void> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Get the ID of the marketplace user
    const currentUserId = marketplaceUser.id;

    // Retrieve the rating to be deleted
    const rating = await postRatingRepository.get(organizationId, tourPostId, postRatingId);
    if (!rating) {
      throw new Error('Tour rating not found');
    }

    // Check if the current user is the owner of the rating
    if (rating.authorId !== currentUserId) {
      throw new Error('Only the owner of the post rating can delete it');
    }

    // Delete the rating using the repository
    await postRatingRepository.delete(organizationId, tourPostId, postRatingId);
  };
}
