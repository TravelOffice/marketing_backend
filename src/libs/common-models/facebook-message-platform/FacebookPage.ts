import { ChatPlatform } from '../graphql-models';

export interface FacebookPage {
  id: string,
  name: string,
  accessToken: string,
  platform: ChatPlatform,
}
