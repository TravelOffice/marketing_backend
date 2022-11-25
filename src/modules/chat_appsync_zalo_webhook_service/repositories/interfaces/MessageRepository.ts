import {
  ZaloPage,
  ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
  ZaloReceivedMessageContent,
} from 'common-models';
import { ZaloConversationWithAssignee } from '../../models/RestrictedZaloModels';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    arg: ReceiveMessageCommandArgs
  ) => Promise<ReceiveMessageCommandResponse>

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
