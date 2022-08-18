import { NewConversationInfo } from '../../models';

export interface SaleAssignmentRepository {
  notifyNewIncomingConversation: (conversationInfor: NewConversationInfo) => Promise<void>

  onSaleAssignmentAutoProcessStarted: (receiptHandler: string) => Promise<void>

  startSaleAssignmentSfnWorkflow: (
    stateMachineArn: string, name: string,
    payload: string,
  ) => Promise<void>

  onSentMessageToCustomer: (
    tenant: string,
    chatPlatform: string,
    pageId: string,
    conversationId: string,
  ) => Promise<void>

  storeSfnTaskToken: (
    tenant: string,
    chatPlatform: string,
    pageId: string,
    conversationId: string,
    taskToken: string,
  ) => Promise<void>
}
