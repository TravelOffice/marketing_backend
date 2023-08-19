import { OrgFeedback } from '../../models/OrgFeedback';
import { CreateOrgFeedbackDto } from '../../dto/CreateOrgFeedbackDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreateOrgFeedbackUseCase {
  invoke(
    currentUser: CognitoUser,
    organization: string,
    createCommentDto: CreateOrgFeedbackDto,
  ): Promise<OrgFeedback>,
}
