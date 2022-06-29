import { ChatPlatform } from 'common-models';

export interface FacebookPage {
  id: string,
  name: string,
  accessToken: string,
  platform: ChatPlatform,
}
