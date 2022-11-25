import { ZaloWebhookMessageEvent } from 'common-models';

export interface ReceiveWebhookUseCase {
  invoke: (
    webhookEvent: ZaloWebhookMessageEvent,
  ) => Promise<void>;
}
