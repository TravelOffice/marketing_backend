import { helper } from 'core';
import { orgFeedbackRepository } from '../repositories';
import { GetOrgFeedbackUseCase } from './interfaces/GetOrgFeedbackUseCase';
import { OrgFeedback } from '../models/OrgFeedback';

export default class GetOrgFeedbackUseCaseImpl implements GetOrgFeedbackUseCase {
  /**
   * Retrieves a specific feedback by its ID and the associated organization ID.
   *
   * @param {string} organization - The ID of the organization associated with the feedback.
   * @param {string} feedbackId - The ID of the feedback to be retrieved.
   * @returns {Promise<OrgFeedback | undefined>} - A promise resolving to the retrieved feedback
   * or undefined if not found.
   */
  invoke = async (organization: string, feedbackId: string): Promise<OrgFeedback | undefined> => {
    // Retrieve the feedback using orgFeedbackRepository.get
    const feedback = await orgFeedbackRepository.get(organization, feedbackId);

    // Check if the comment exists
    if (!feedback) {
      return undefined; // Return undefined if the feedback is not found
    }

    // Exclude unnecessary data from the feedback object and return as OrgFeedback
    return helper.excludeDataFromObject(feedback) as OrgFeedback;
  };
}
