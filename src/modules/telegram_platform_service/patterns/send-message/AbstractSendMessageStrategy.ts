import { TelegramMessage } from 'common-models';
import { TelegramSendMessageData } from '../../models/send-message/SendMessageData';
import TelegramPlatformProvider from '../../providers/TelegramPlatformProvider';

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 */
export interface SendMessageStrategy {
  executor: TelegramPlatformProvider,
}

export abstract class AbstractSendMessageStrategy implements SendMessageStrategy {
  // Executor to excute send message function
  public readonly executor: TelegramPlatformProvider;

  /**
   * Constructor
   * @param caller Telegram provider
   */
  constructor(executor: TelegramPlatformProvider) {
    this.executor = executor;
  }

  /**
   * Send message to Telegram user
   * Message type can be text, photo, audio, video, document
   * @param accessToken Telegram access token represents bot id
   * @param chatId Chat id represents a conversation
   * @param data Send message data
   */
  abstract send(
    accessToken: string,
    chatId: string,
    data: TelegramSendMessageData,
  ): Promise<TelegramMessage>;
}
