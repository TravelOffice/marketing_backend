import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { GetOrgFeedbackListUseCase } from './interfaces/GetOrgFeedbackListUseCase';
import { orgFeedbackRepository } from '../repositories';

export default class GetOrgFeedbackListUseCaseImpl implements GetOrgFeedbackListUseCase {
  /**
   * Retrieves the list feedback of the organization by the associated the organization ID.
   *
   * @param organizationId - The ID of organization.
   * @param paginationParams
   * @returns A Promise that resolves to an array of feedback.
   */
  invoke = async (
    organizationId: string,
    paginationParams: PaginationParams,
  ) => orgFeedbackRepository.listByOrg(
    organizationId,
    paginationParams,
  );
}
