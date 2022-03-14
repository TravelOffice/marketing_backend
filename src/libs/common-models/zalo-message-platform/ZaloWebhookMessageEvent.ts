/**
 * Zalo webhook event definition
 * @example
 * ```json
 * {
 *   "app_id": "360846524894903967",
 *   "sender": {
 *     "id": "388613280879808645"
 *   },
 *   "recipient": {
 *     "id": "246845883529197922"
 *   },
 *   "event_name": "oa_send_text",
 *   "message": {
 *     "text": "message",
 *     "msg_id": "465928106db72e8cba7"
 *   },
 *   "user_id_by_app": "552177279717587730",
 *   "timestamp": "1543980770426"
 * }
 * ```
 */
export interface ZaloWebhookMessageEvent {
  app_id: string,
  sender: { id: string },
  recipient: { id: string },
  event_name: string,
  timestamp: number,
  user_id_by_app: string,
  message: ZaloMessageContent // Based on type of event
}

export type ZaloMessageContent = any; // TODO: Need to update according to Zalo official API document