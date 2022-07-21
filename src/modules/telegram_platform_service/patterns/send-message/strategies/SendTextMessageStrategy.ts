import { TelegramMessage } from 'common-models';
import { TelegramSendMessageData } from '../../../models/send-message/SendMessageData';
import { AbstractSendMessageStrategy } from '../AbstractSendMessageStrategy';

// eslint-disable-next-line import/prefer-default-export
export class SendTextMessageStrategy extends AbstractSendMessageStrategy {
  public send(
    accessToken: string,
    chatId: string,
    data: TelegramSendMessageData,
  ): Promise<TelegramMessage> {
    return this.executor.sendTextMessage(
      accessToken,
      chatId,
      data.text || '',
      data.options,
    );
  }
}
