import { WebhookMessageEvent, ReceiveMessageCommandResponse } from 'common-models';

export interface AppSyncRepository {
  sendReceivedMessageCommand: (webhookEvent: WebhookMessageEvent) => Promise<ReceiveMessageCommandResponse>
}
