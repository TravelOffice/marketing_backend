export interface ZaloPage {
  id: string,
  accessToken: string,
  refreshToken: string,
  expireIn: number,
  name: string,
  description: string,
  avatar: string,
  cover: string,
  isVerified: boolean,
}
