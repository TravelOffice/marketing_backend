import { GroupWithAvatar, UserWithAvatar } from '../../models';

export interface GetTelegramUserProfileUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    chatId: string,
    userId: string,
  ) => Promise<UserWithAvatar | GroupWithAvatar>;
}
