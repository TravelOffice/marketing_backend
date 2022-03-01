export interface LinkFacebookPageUseCase {
  invoke : (currentUserId: string, pageId: string, userAccessToken: string) => Promise<any>
}
