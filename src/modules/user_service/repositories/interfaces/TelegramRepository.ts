import { TelegramBot } from 'common-models';

export interface TelegramRepository {
  get: (tenantId: string, pageId: string) => Promise<TelegramBot>
  deleteWebhook: (accessToken: string) => Promise<void>
}
