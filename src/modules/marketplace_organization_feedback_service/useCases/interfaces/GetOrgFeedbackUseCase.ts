import { OrgFeedback } from '../../models/OrgFeedback';

export interface GetOrgFeedbackUseCase {
  invoke(organizationId: string, feedbackId: string): Promise<OrgFeedback | undefined>,
}
