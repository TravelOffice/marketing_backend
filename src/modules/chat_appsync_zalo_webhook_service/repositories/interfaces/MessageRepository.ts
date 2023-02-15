import {
  ZaloPage,
  ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
  ZaloReceivedMessageContent,
  ChatPlatform,
} from 'common-models';
import { ZaloConversationWithAssignee } from '../../models/RestrictedZaloModels';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    arg: ReceiveMessageCommandArgs
  ) => Promise<ReceiveMessageCommandResponse>

  saveChatMessage: (
    tenantId: string,
    platform: ChatPlatform,
    page: ZaloPage,
    customerId: string,
    message: ZaloReceivedMessageContent,
    eventName: string,
  ) => Promise<void>

  saveConversation: (
    tenantId: string,
    page: ZaloPage,
    customerId: string,
    message: ZaloReceivedMessageContent
  ) => Promise<ZaloConversationWithAssignee>

  getMessageMetadata: (
    tenantId: string,
    page: ZaloPage,
    customerId: string,
    messageId: string
  ) => Promise<string>
}
