import { marketplaceUserRepository, postCommentRepository } from '../repositories';
import { DeletePostCommentUseCase } from './interfaces/DeletePostCommentUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class DeletePostCommentUseCaseImpl implements DeletePostCommentUseCase {
  /**
   * Deletes a post comment by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} tourPostId - The ID of the tour post associated with the comment.
   * @param {string} postCommentId - The ID of the comment to be deleted.
   * @returns {Promise<void>} - A promise indicating the success of the deletion.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    postCommentId: string,
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

    // Retrieve the comment to be deleted
    const comment = await postCommentRepository.get(tourPostId, postCommentId);
    if (!comment) {
      throw new Error('Tour comment not found');
    }

    // Check if the current user is the owner of the comment
    if (comment.authorId !== currentUserId) {
      throw new Error('Only the owner of the post comment can delete it');
    }

    // Delete the comment using the repository
    await postCommentRepository.delete(tourPostId, postCommentId);
  };
}
