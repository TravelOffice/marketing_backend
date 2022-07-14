import { ChatPlatform } from 'common-models';

export interface PageRepository {
  checkPageLinkedToAnotherTenant: (
    pageId: string, tenantId: string, platform: ChatPlatform,
  ) => Promise<boolean>
}
