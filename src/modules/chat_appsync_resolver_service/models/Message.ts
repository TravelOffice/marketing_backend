import { SendFacebookMessageRequestPayload } from './SendFacebookMessageRequestPayload';

export interface Message {
  id: string,
  sender: string,
  recipient: string,
  timestamp: number,
  messageData: any,
}

export const toSendFbMessagePayload = (message: Message): SendFacebookMessageRequestPayload => {
  return {
    recipient: { id: message.recipient },
    message: {
      text: message.messageData.text
    }
  };
};
