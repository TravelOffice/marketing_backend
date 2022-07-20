import { TelegramMessage } from 'common-models';
import { TelegramSendMessageData } from '../../models/send-message/SendMessageData';

export interface SendMessageUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    chatId: string,
    data: TelegramSendMessageData,
  ) => Promise<TelegramMessage>;
}
