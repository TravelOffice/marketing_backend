import { TelegramBot } from 'common-models';

export interface TenantTelegramPage extends TelegramBot {
  tenantId: string
}
