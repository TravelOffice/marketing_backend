import { TelegramWebhookMessageEvent } from 'common-models';

export interface ReceiveTelegramWebhookUseCase {
  invoke: (webhookEvent: TelegramWebhookMessageEvent, tenantId: string) => Promise<void>;
}
