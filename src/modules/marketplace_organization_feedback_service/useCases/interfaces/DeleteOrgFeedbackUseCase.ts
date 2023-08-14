import { CognitoUser } from '../../models/CognitoUser';

export interface DeleteOrgFeedbackUseCase {
  invoke(currentUser: CognitoUser, organizationId: string, feedbackId: string): Promise<void>,
}
