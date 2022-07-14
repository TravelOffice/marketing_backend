import { ChatPlatform } from 'common-models';
import { Page } from '../../models/Page';

export interface PageRepository {
  get: (tenantId: string, platform: ChatPlatform) => Promise<Page>
}
