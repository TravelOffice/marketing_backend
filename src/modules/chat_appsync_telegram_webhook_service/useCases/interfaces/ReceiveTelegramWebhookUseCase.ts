import { TelegramWebhookMessageEvent } from 'common-models';

export interface ReceiveTelegramWebhookUseCase {
  invoke: (
    webhookEvent: TelegramWebhookMessageEvent,
    tenantId: string,
    secretToken: string
  ) => Promise<void>;
}
