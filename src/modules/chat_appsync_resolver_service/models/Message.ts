import { AppsyncFacebookSendMessageData, AppSyncReceiveMessageData, AppSyncSendMessageData, AppsyncZaloSendMessageData, ChatPlatform } from 'common-models';
import { SendFacebookMessageRequestPayload } from './facebook/SendFacebookMessageRequestPayload';
import { SendZaloMessageRequestPayload } from './zalo/SendZaloMessageRequestPayload';

export interface Message {
  id: string,
  sender: string,
  recipient: string,
  timestamp: number,
  messageData: AppSyncReceiveMessageData,
  chatPlatform: ChatPlatform
}

export interface MessageForSend {
  recipient: string,
  chatPlatform: ChatPlatform,
  messageData: AppSyncSendMessageData
}

export const toSendFbMessagePayload = (message: MessageForSend): SendFacebookMessageRequestPayload => {
  return {
    recipient: { id: message.recipient },
    message: message.messageData as AppsyncFacebookSendMessageData,
    messaging_type: 'MESSAGE_TAG',
    tag: 'ACCOUNT_UPDATE'
  };
};

export const toSendZaloMessagePayload = (message: MessageForSend): SendZaloMessageRequestPayload => {
  const messageContent: AppsyncZaloSendMessageData = Object.assign({}, message.messageData);
  return {
    recipient: {
      user_id: message.recipient
    },
    message: messageContent
  }
}
