import { FacebookWebhookMessageEvent } from 'common-models';

export interface ReceiveWebhookUseCase {
  invoke: (
    webhookEvent: FacebookWebhookMessageEvent,
  ) => Promise<void>;
}
