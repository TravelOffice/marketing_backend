import { SendMessageData, TelegramMessage } from 'common-models';

export interface SendMessageUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    chatId: string,
    messageData: SendMessageData,
  ) => Promise<TelegramMessage>;
}
