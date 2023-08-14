import { helper } from 'core';
import { OrgFeedback } from '../models/OrgFeedback';
import { marketplaceUserRepository, orgFeedbackRepository } from '../repositories';
import { CreateOrgFeedbackUseCase } from './interfaces/CreateOrgFeedbackUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreateOrgFeedbackDto } from '../dto/CreateOrgFeedbackDto';

export default class CreateOrgFeedbackUseCaseImpl implements CreateOrgFeedbackUseCase {
  /**
   * Creates a feedback on a organization by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param organizationId
   * @param {CreateOrgFeedbackDto} createOrgFeedbackDto - The data for creating the feedback.
   * @returns {Promise<OrgFeedback>} - A promise resolving to the created post feedback.
   */
  invoke = async (
    currentUser: CognitoUser,
    organizationId: string,
    createOrgFeedbackDto: CreateOrgFeedbackDto,
  ): Promise<OrgFeedback> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Get the current timestamp
    const now = Date.now();

    // Generate a unique index for the feedback
    const feedbackIndex = await orgFeedbackRepository.generateCode();

    // Create the feedback object
    const orgFeedback = {
      ...createOrgFeedbackDto,
      code: feedbackIndex,
      authorId: marketplaceUserId,
      organizationId,
      createdAt: now,
      updatedAt: now,
      // Local secondary index with format <tenant>#<username>
      // for getting feedback created by specific user
      lsi1: marketplaceUserId,
    } as OrgFeedback;

    // Add the feedback to DynamoDB using the repository
    const createdOrgFeedback = await orgFeedbackRepository.create(orgFeedback);
    return helper.excludeDataFromObject(createdOrgFeedback) as OrgFeedback;
  };
}
