import { ChatPlatform } from 'common-models';
import { TenantTelegramPage } from '../../models/TenantTelegramPage';

export interface PageRepository {
  get: (tenantId: string, platform: ChatPlatform) => Promise<TenantTelegramPage>
}
