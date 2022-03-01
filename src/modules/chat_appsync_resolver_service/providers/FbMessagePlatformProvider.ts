import axios, { AxiosInstance } from 'axios';
import {
  SendFacebookMessageRequestPayload,
  FacebookMessageResponsePayload,
} from '../models';

export default class FbMessagePlatformProvider {
  private _messagePlatformBaseUrl: string = 'https://graph.facebook.com/v13.0';
  private _messagePlatformRequestTimeout: number = 60000
  private _axiosInstance: AxiosInstance;

  /**
   * Constructor, init http client to communicate Fb Message Platform APIs
   */
  constructor() {
    this._axiosInstance = axios.create({
      baseURL: this._messagePlatformBaseUrl,
      timeout: this._messagePlatformRequestTimeout, // Milliseconds
    });
  }

  /**
   * Send message from page admin to customer
   * @param pageToken Page token stored in DynamoDB table
   * @param recipient Recipient that page admin want to send to
   * @param message Message content. In the future, others message type will be supported such as image | video | url
   */
  sendMessage = async (pageToken: string, messagePayload: SendFacebookMessageRequestPayload): Promise<void> => {
    const response = await this._axiosInstance.post(
      `/me/messages?access_token=${pageToken}`,
      messagePayload,
    );
    console.info(
      `[FbMessagePlatformProvider.sendMessage] The message from page ${pageToken} has been sent, response message from Message Platform`,
      response.data
    );
  }

  /**
   * Get conversations list of given page
   * @param pageId Id of Facebook page
   */
  getConversations = async (pageToken: string, pageId: string): Promise<FacebookMessageResponsePayload> => {
    const response = await this._axiosInstance.get(`${pageId}/conversations?access_token=${pageToken}&fields=snippet,senders,participants,message_count,updated_time`);
    console.info(
      `[FbMessagePlatformProvider.getConversations] Conversations of page ${pageId}`,
      response.data
    );
    return response.data;
  };

  /**
   * Get messages of given conversation
   * @param conversationId Conversation id
   * @param before Before token for paging
   */
  getMessages = async (pageToken: string, conversationId: string, before?: string): Promise<FacebookMessageResponsePayload> => {
    let requestPath = `${conversationId}/messages?access_token=${pageToken}&fields=message,id,created_time,to,from&limit=10`;
    if (before) { // Get first page with limit 10 if before is null
      requestPath += `&before=${before}`;
    }
    const response = await this._axiosInstance.get(requestPath);
    console.info(
      `[FbMessagePlatformProvider.getMessages] Return messages of conversation ${conversationId} with data`,
      response.data
    );
    return response.data;
  };
}
