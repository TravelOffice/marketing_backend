import { SendMessageOptions, TelegramMessage } from 'common-models';

export interface SendMessageUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    chatId: string,
    text: string,
    options?: SendMessageOptions,
  ) => Promise<TelegramMessage>;
}
