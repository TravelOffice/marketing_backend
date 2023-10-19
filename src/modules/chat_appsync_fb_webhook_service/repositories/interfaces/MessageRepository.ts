import {
  ChatPlatform,
  DDBMessage,
  FacebookConversation,
  FacebookMessage,
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
    message: FacebookMessage,
  ) => Promise<Partial<DDBMessage>>

  getConversationInfo: (
    page: FacebookPage,
    customerId: string,
  ) => Promise<FacebookConversation>

  saveConversation: (
    tenantId: string,
    page: FacebookPage,
    message: FacebookMessage,
    fbConversation: FacebookConversation,
  ) => Promise<FacebookConversationWithAssignee>

  getMessageInfo: (
    page: FacebookPage,
    messageId: string,
  ) => Promise<FacebookMessage>

}
