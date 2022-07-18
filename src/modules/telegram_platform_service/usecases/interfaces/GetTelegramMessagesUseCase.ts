import { TelegramPagingMessage } from '../../models';

export interface GetTelegramMessagesUseCase {
  invoke: (
    tenantId: string,
    assigneeId: string,
    botId: string,
    chatId: string,
    nextToken?: string,
    limit?: number,
  ) => Promise<TelegramPagingMessage>;
}
