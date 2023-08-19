import { helper } from 'core';
import { marketplaceUserRepository, orgFeedbackRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
import { UpdateOrgFeedbackUseCase } from './interfaces/UpdateOrgFeedbackUseCase';
import { UpdateOrgFeedbackDto } from '../dto/UpdateOrgFeedbackDto';
import { OrgFeedback } from '../models/OrgFeedback';

export default class UpdateOrgFeedbackUseCaseImpl implements UpdateOrgFeedbackUseCase {
  private allowedUpdatingKeys: (keyof UpdateOrgFeedbackDto)[] = [
    'description',
  ];

  /**
   * Updates a post feedback by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} organization - The ID of the organization associated with the feedback.
   * @param {string} feedbackId - The ID of the feedback to be updated.
   * @param {UpdateOrgFeedbackDto} updateOrgFeedbackDto - The data for updating the feedback.
   * @returns {Promise<OrgFeedback>} - A promise indicating the success of the update.
   */
  invoke = async (
    currentUser: CognitoUser,
    organization: string,
    feedbackId: string,
    updateOrgFeedbackDto: UpdateOrgFeedbackDto,
  ): Promise<OrgFeedback> => {
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

    // Retrieve the feedback to be updated
    const feedback = await orgFeedbackRepository.get(organization, feedbackId);
    if (!feedback) {
      throw new Error('Organization feedback not found');
    }

    // Check if the current user is the owner of the feedback
    if (feedback.authorId !== currentUserId) {
      throw new Error('Only the owner of the feedback can update it');
    }

    // Extract data from the updateOrgFeedbackDto based on allowed keys
    const allowedUpdatingData = helper.extractDataFromObject(
      updateOrgFeedbackDto,
      this.allowedUpdatingKeys,
    );

    // Get updated data for the feedback
    const updatingOrgFeedbackData = await this.getDataToUpdate(allowedUpdatingData);

    // Update the feedback using the repository
    const updatedFeedback = await orgFeedbackRepository.update(
      organization,
      feedbackId,
      updatingOrgFeedbackData,
    );
    return helper.excludeDataFromObject(updatedFeedback) as OrgFeedback;
  };

  /**
   * Transform dto to expected data which should be used to update.
   * Also, some kinds of data should be validated before updating.
   * @param updatingFeedbackData
   */
  private async getDataToUpdate(
    updatingFeedbackData: Partial<UpdateOrgFeedbackDto>,
  ): Promise<Partial<OrgFeedback>> {
    // New data to update
    return {
      ...updatingFeedbackData,
      updatedAt: Date.now(),
    };
  }
}
