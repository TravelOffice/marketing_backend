import { ChatPlatform } from 'common-models';

export interface UnlinkPageUseCase {
  invoke: (username: string, platform: ChatPlatform, pageId: string) => Promise<void>;
}
