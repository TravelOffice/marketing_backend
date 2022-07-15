import { TelegramBot } from 'common-models';

export interface TelegramPageRepository {
  getBotInfo: (token: string) => Promise<TelegramBot>
  saveToDynamo: (tenantId: string, page: TelegramBot) => Promise<void>
  registerWebhook: (
    accessToken: string, webhookUrl: string, tenantId: string, secretToken: string,
  ) => Promise<boolean>;
}
