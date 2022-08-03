import { User, UserProfilePhotos } from 'common-models';

export interface GetTelegramUserProfileUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    chatId: string,
    userId: string,
  ) => Promise<User | { user: User, avatars: UserProfilePhotos }>;
}
