import { SendFacebookMessageRequestPayload } from './facebook/SendFacebookMessageRequestPayload';
import { SendZaloMessageRequestPayload } from './zalo/SendZaloMessageRequestPayload';
import { ChatPlatform } from 'common-models';
export interface Message {
  id: string,
  sender: string,
  recipient: string,
  timestamp: number,
  messageData: any,
  chatPlatform: ChatPlatform
}

export const toSendFbMessagePayload = (message: Message): SendFacebookMessageRequestPayload => {
  return {
    recipient: { id: message.recipient },
    message: {
      text: message.messageData.text
    },
    messaging_type: 'MESSAGE_TAG',
    tag: 'ACCOUNT_UPDATE'
  };
};

export const toSendZaloMessagePayload = (message: Message): SendZaloMessageRequestPayload => {
  return {
    recipient: {
      user_id: message.recipient
    },
    message: {
      text: message.messageData.text
    }
  }
}
