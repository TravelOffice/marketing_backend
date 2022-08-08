import { ChatPlatform } from 'common-models';

export interface UnlinkPageUseCase {
  invoke: (tenantId: string, platform: ChatPlatform, pageId: string) => Promise<void>;
}
