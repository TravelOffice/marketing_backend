import { AppsyncFacebookSendMessageData } from 'common-models';

export interface SendFacebookMessageRequestPayload {
  recipient: { id: string },
  message: AppsyncFacebookSendMessageData,
  messaging_type?: string,
  tag?: string,
  // typing_on: display the typing bubble
  // typing_off: remove the typing bubble
  // mark_seen: display the confirmation icon
  sender_action?: string,

}
