import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { OrgFeedback } from '../../models/OrgFeedback';

export interface OrgFeedbackRepository {
  listByOrg(
    organizationId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<OrgFeedback> | undefined>,

  create(comment: OrgFeedback): Promise<OrgFeedback>,

  get(organizationId: string, id: string): Promise<OrgFeedback | undefined>,

  update(organizationId: string, id: string, feedback: Partial<OrgFeedback>): Promise<OrgFeedback>,

  delete(organizationId: string, id: string): Promise<void>,

  generateCode(): Promise<string>,
}
