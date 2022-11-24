import { ChatPlatform } from '../graphql-models';

export interface ZaloPage {
  id: string,
  accessToken: string,
  refreshToken: string,
  accessTokenExpireIn: number,
  refreshTokenExpireIn: number,
  name: string,
  description: string,
  avatar: string,
  cover: string,
  isVerified: boolean,
  platform: ChatPlatform,
}
