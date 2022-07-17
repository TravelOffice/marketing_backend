import { ChatPlatform, TelegramBot } from 'common-models';

export interface PageRepository {
  get: (tenantId: string, platform: ChatPlatform) => Promise<TelegramBot>
}
