import { marketplaceUserRepository, orgFeedbackRepository } from '../repositories';
import { DeleteOrgFeedbackUseCase } from './interfaces/DeleteOrgFeedbackUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class DeleteOrgFeedbackUseCaseImpl implements DeleteOrgFeedbackUseCase {
  /**
   * Deletes a post feedback by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param organizationId - The ID of organization.
   * @param {string} feedbackId - The ID of the feedback to be deleted.
   * @returns {Promise<void>} - A promise indicating the success of the deletion.
   */
  invoke = async (
    currentUser: CognitoUser,
    organizationId: string,
    feedbackId: string,
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

    // Retrieve the feedback to be deleted
    const feedback = await orgFeedbackRepository.get(organizationId, feedbackId);
    if (!feedback) {
      throw new Error('Organization Feedback not found');
    }

    // Check if the current user is the owner of the feedback
    if (feedback.authorId !== currentUserId) {
      throw new Error('Only the owner of the feedback can delete it');
    }

    // Delete the feedback using the repository
    await orgFeedbackRepository.delete(organizationId, feedbackId);
  };
}
