import { OrgFeedback } from '../../models/OrgFeedback';
import { UpdateOrgFeedbackDto } from '../../dto/UpdateOrgFeedbackDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdateOrgFeedbackUseCase {
  invoke(
    currentUser: CognitoUser,
    organization: string,
    feedbackId: string,
    updateOrgFeedbackDto: UpdateOrgFeedbackDto,
  ): Promise<OrgFeedback>,
}
