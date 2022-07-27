import axios, { AxiosInstance } from 'axios';
import { FacebookConversation } from 'common-models';
import { FacebookMessageResponsePayload } from '../models/Facebook';
import logger from '../utils/logger';

export default class FbMessagePlatformProvider {
  private readonly messagePlatformBaseUrl: string = 'https://graph.facebook.com/v13.0';

  private readonly messagePlatformRequestTimeout: number = 60000;

  private readonly axiosInstance: AxiosInstance;

  /**
   * Constructor, init http client to communicate Fb Message Platform APIs
   */
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.messagePlatformBaseUrl,
      timeout: this.messagePlatformRequestTimeout, // Milliseconds
    });
  }

  /**
   * Get conversation id by page user
   * @param pageToken Page token to access data from message platform
   * @param pageId Id of Facebook page
   * @param pageUserId Id of user
   */
  getConversation = async (
    pageToken: string,
    pageId: string,
    pageUserId: string,
  ): Promise<FacebookConversation> => {
    const params = {
      access_token: pageToken,
      user_id: pageUserId,
      fields: 'snippet,senders,participants,message_count,updated_time',
    };
    const response = await this.axiosInstance.get(`${pageId}/conversations`, { params });
    const { data } = response.data as FacebookMessageResponsePayload;
    if (!data || data.length === 0) {
      throw new Error(`[FbMessagePlatformProvider.getConversation]: conversation of page ${pageId} not found!`);
    }
    logger.log(
      `[FbMessagePlatformProvider.getConversation] Conversation of page ${pageId} ${JSON.stringify(response.data)}`,
    );
    return data[0];
  };
}
