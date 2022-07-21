import axios, { AxiosInstance } from 'axios';
import {
  File as TelegramFile, FileOptions,
  SendAudioOptions,
  SendMessageOptions,
  SendPhotoOptions,
  SendVideoOptions,
  TelegramMessage,
} from 'common-models';
import { TelegramAttachmentContent } from '../models/send-message/SendMessageOptions';
import logger from '../utils/logger';

export default class TelegramPlatformProvider {
  // Fill telegram bot api endpoint here
  private readonly messagePlatformBaseUrl: string = 'https://api.telegram.org';

  // Timeout for telegram api
  private readonly messagePlatformRequestTimeout: number = 60000;

  // Instance to call api
  private readonly axiosInstance: AxiosInstance;

  private readonly get = async (url: string, params?: Object) => {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data.result;
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        logger.log(`[TelegramPlatformProvider.get] Error: ${JSON.stringify(e)}`);
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logger.log(`[TelegramPlatformProvider.get] Server response an error with data ${JSON.stringify(e.response)}`);
        } else if (e.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          logger.log(e.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.log(`[TelegramPlatformProvider.get] Setting up request error ${e.message}`);
        }
        logger.log(e.config);
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };

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

  /**
   * Send photo message
   * @param accessToken Telegram bot token
   * @param chatId ID of conversation
   * @param photo Content of message
   * @param options SendMessageOptions object
   * @param fileOptions File options
   * @returns Sent message object
   */
  sendPhoto = async (
    accessToken: string,
    chatId: string,
    photo: TelegramAttachmentContent,
    options?: SendPhotoOptions,
    fileOptions?: FileOptions,
  ): Promise<TelegramMessage> => {
    const params = {
      chat_id: chatId,
      photo,
      options,
      fileOptions,
    };
    return this.get(`bot${accessToken}/sendPhoto`, params);
  };

  /**
   * Send photo message. Audio must be in the .MP3 or .M4A format
   * @param accessToken Telegram bot token
   * @param chatId ID of conversation
   * @param audio Content of message
   * @param options SendMessageOptions object
   * @param fileOptions File options
   * @returns Sent message object
   */
  sendAudio = async (
    accessToken: string,
    chatId: string,
    audio: TelegramAttachmentContent,
    options?: SendAudioOptions,
    fileOptions?: FileOptions,
  ): Promise<TelegramMessage> => {
    const params = {
      chat_id: chatId,
      audio,
      options,
      fileOptions,
    };
    return this.get(`bot${accessToken}/sendAudio`, params);
  };

  /**
   * Send video message.
   * Telegram clients support MPEG4 videos (other formats may be sent as Document)
   * @param accessToken Telegram bot token
   * @param chatId ID of conversation
   * @param video Content of message
   * @param options SendMessageOptions object
   * @param fileOptions File options
   * @returns Sent message object
   */
  sendVideo = async (
    accessToken: string,
    chatId: string,
    video: TelegramAttachmentContent,
    options?: SendVideoOptions,
    fileOptions?: FileOptions,
  ): Promise<TelegramMessage> => {
    const params = {
      chat_id: chatId,
      video,
      options,
      fileOptions,
    };
    return this.get(`bot${accessToken}/sendVideo`, params);
  };

  /**
   * Send document message.
   * @param accessToken Telegram bot token
   * @param chatId ID of conversation
   * @param document Content of message
   * @param options SendMessageOptions object
   * @param fileOptions File options
   * @returns Sent message object
   */
  sendDocument = async (
    accessToken: string,
    chatId: string,
    document: TelegramAttachmentContent,
    options?: SendVideoOptions,
    fileOptions?: FileOptions,
  ): Promise<TelegramMessage> => {
    const params = {
      chat_id: chatId,
      document,
      options,
      fileOptions,
    };
    return this.get(`bot${accessToken}/sendDocument`, params);
  };

  /**
   * Get basic information about a file
   * @param accessToken Telegram bot token
   * @param fileId File identifier to get information about
   * @returns a File object
   */
  getFile = async (
    accessToken: string,
    fileId: string,
  ): Promise<TelegramFile> => {
    const params = {
      file_id: fileId,
    };
    return this.get(`bot${accessToken}/getFile`, params);
  };

  /**
   * Get absolute telegram file path
   * @param accessToken Telegram bot token
   * @param filePath The telegram relative path
   * @returns a File path
   */
  getFilePath = (
    accessToken: string,
    filePath: string,
  ): string => `${this.messagePlatformBaseUrl}/file/bot${accessToken}/${filePath}`;
}
