import {
  ChatPlatform,
  FacebookConversation,
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

  saveChatMessage: (
    tenantId: string,
    platform: ChatPlatform,
    page: FacebookPage,
    fbConversationId: string,
    message: FacebookMessageContent,
  ) => Promise<void>

  getConversationInfo: (
    page: FacebookPage,
    customerId: string,
  ) => Promise<FacebookConversation>

  saveConversation: (
    tenantId: string,
    page: FacebookPage,
    message: FacebookMessageContent,
    fbConversation: FacebookConversation,
  ) => Promise<FacebookConversationWithAssignee>
}
