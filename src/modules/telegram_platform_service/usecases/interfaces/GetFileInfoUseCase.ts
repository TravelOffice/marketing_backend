import { RestrictedTelegramFile } from '../../models';

export interface GetFileInfoUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    chatId: string,
    fileId: string,
  ) => Promise<RestrictedTelegramFile | undefined>;
}
