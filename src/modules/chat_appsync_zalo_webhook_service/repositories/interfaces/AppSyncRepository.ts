import { ReceiveMessageCommandResponse, ZaloWebhookMessageEvent } from 'common-models';

export interface AppSyncRepository {
  sendReceivedMessageCommand: (
    webhookEvent: ZaloWebhookMessageEvent,
  ) => Promise<ReceiveMessageCommandResponse>
}
