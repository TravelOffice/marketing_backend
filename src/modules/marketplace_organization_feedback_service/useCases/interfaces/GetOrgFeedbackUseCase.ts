import { OrgFeedback } from '../../models/OrgFeedback';

export interface GetOrgFeedbackUseCase {
  invoke(organization: string, feedbackId: string): Promise<OrgFeedback | undefined>,
}
