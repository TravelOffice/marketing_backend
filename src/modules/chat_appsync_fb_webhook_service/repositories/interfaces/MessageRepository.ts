import {
  FacebookMessageContent,
  FacebookPage,
  ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
} from 'common-models';
import { FacebookConversationWithAssignee } from '../../models/RestrictedFacebookModels';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    arg: ReceiveMessageCommandArgs
  ) => Promise<ReceiveMessageCommandResponse>

  saveConversation: (
    tenantId: string,
    page: FacebookPage,
    customerId: string,
    message: FacebookMessageContent
  ) => Promise<FacebookConversationWithAssignee>
}
