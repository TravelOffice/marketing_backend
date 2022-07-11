import axios, { AxiosInstance } from 'axios';

export default class TelegramPlatformProvider {
  // Fill telegram bot api endpoint here
  private readonly messagePlatformBaseUrl: string = '';

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
   * Send message to Telegram user
   */
  sendMessage = async () => {
    throw new Error('Method is not implemented yet.');
  };
}
