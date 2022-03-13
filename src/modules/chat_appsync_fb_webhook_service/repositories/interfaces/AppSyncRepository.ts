import { FacebookWebhookMessageEvent, ReceiveMessageCommandResponse } from 'common-models';

export interface AppSyncRepository {
  sendReceivedMessageCommand: (webhookEvent: FacebookWebhookMessageEvent) => Promise<ReceiveMessageCommandResponse>
}
