import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { OrgFeedback } from '../../models/OrgFeedback';

export interface OrgFeedbackRepository {
  listByOrg(
    organization: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<OrgFeedback> | undefined>,

  create(comment: OrgFeedback): Promise<OrgFeedback>,

  get(organization: string, id: string): Promise<OrgFeedback | undefined>,

  update(organization: string, id: string, feedback: Partial<OrgFeedback>): Promise<OrgFeedback>,

  delete(organization: string, id: string): Promise<void>,

  generateCode(): Promise<string>,
}
