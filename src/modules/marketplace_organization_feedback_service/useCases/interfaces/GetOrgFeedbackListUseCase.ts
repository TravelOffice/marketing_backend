import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { OrgFeedback } from '../../models/OrgFeedback';

export interface GetOrgFeedbackListUseCase {
  invoke(
    organizationId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<OrgFeedback> | undefined>,
}
