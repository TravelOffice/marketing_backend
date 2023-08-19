import { CognitoUser } from '../../models/CognitoUser';

export interface DeleteOrgFeedbackUseCase {
  invoke(currentUser: CognitoUser, organization: string, feedbackId: string): Promise<void>,
}
