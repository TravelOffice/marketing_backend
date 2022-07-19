import axios, { AxiosInstance } from 'axios';
import { SendMessageOptions, TelegramMessage } from 'common-models';
import logger from '../utils/logger';

export default class TelegramPlatformProvider {
  // Fill telegram bot api endpoint here
  private readonly messagePlatformBaseUrl: string = 'https://api.telegram.org';

  // Timeout for telegram api
  private readonly messagePlatformRequestTimeout: number = 60000;

  // Instance to call api
  private readonly axiosInstance: AxiosInstance;

  /**
   * Constructor, init http client to communicate Telegram Message Platform APIs
   */
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.messagePlatformBaseUrl,
      timeout: this.messagePlatformRequestTimeout, // Milliseconds
    });
  }

  /**
   * Get chat (aka conversation) information
   */
  getChat = async () => {
    throw new Error('Method is not implemented yet.');
  };

  /**
   * Get user profile information
   */
  getUserProfile = async () => {
    throw new Error('Method is not implemented yet.');
  };

  /**
   * Send text message
   * @param accessToken Telegram bot token
   * @param chatId ID of conversation
   * @param text Content of message
   * @param options SendMessageOptions object
   * @returns Sent message object
   */
  sendTextMessage = async (
    accessToken: string,
    chatId: string,
    text: string,
    options?: SendMessageOptions,
  ): Promise<TelegramMessage> => {
    const params = {
      chat_id: chatId,
      text,
      options,
    };
    return this.get(`bot${accessToken}/sendMessage`, params);
  };

  private readonly get = async (url: string, params?: Object) => {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data.result;
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        logger.log(`[TelegramPlatformProvider.get] Error: ${JSON.stringify(e)}`);
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };
}
