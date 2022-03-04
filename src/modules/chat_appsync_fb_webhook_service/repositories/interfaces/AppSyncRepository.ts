import { WebhookMessageEvent, ReceiveMessageCommandResponse } from '../../models';

export interface AppSyncRepository {
  sendReceivedMessageCommand: (webhookEvent: WebhookMessageEvent) => Promise<ReceiveMessageCommandResponse>
}
