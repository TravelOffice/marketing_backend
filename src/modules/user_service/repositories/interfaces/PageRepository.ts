import { ChatPlatform } from 'common-models';
import { Page } from '../../models/Page';

export interface PageRepository {
  list: (tenantId: string) => Promise<Array<Page>>
  delete: (tenantId: string, platform: ChatPlatform, pageId: string) => Promise<void>
}
