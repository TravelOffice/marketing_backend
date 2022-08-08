import { NewConversationInfo } from '../../models';

export interface SaleAssignmentRepository {
  notifyNewIncomingConversation: (conversationInfor: NewConversationInfo) => Promise<void>
  onSaleAssignmentAutoProcessStarted: (receiptHandler: string) => Promise<void>
}
