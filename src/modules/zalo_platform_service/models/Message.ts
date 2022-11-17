import {
  AppsyncFacebookSendMessageData,
  AppSyncReceiveMessageData,
  AppSyncSendMessageData,
  AppsyncZaloSendMessageData,
  ChatPlatform,
} from 'common-models';
import { SendFacebookMessageRequestPayload } from './facebook/SendFacebookMessageRequestPayload';
import { SendZaloMessageRequestPayload } from './zalo/SendZaloMessageRequestPayload';

export interface BaseMessageMutationArgs {
  // Message id
  id?: string,
  // Sender id
  sender: string,
  // Recipient id
  recipient: string,
  /**
   * AppSyncReceiveMessageData for receive message mutation
   * AppSyncSendMessageData for send message muatation
   */
  messageData: AppSyncReceiveMessageData | AppSyncSendMessageData,
  // Chat platform such as fb / zalo / telegram
  chatPlatform: ChatPlatform,
}

export interface SendMessageMutationArgs extends BaseMessageMutationArgs {
  conversationId: string,
}

export interface ReceiveMessageMutationArgs extends BaseMessageMutationArgs {
  // Message id
  id: string,
  // Sending time
  timestamp: number,
  // Username
  username: string,
  // Tenant
  tenant: string,
}

export interface MessageForSend {
  recipient: string,
  chatPlatform: ChatPlatform,
  messageData: AppSyncSendMessageData
}

export const toSendFbMessagePayload = (
  message: MessageForSend,
): SendFacebookMessageRequestPayload => ({
  recipient: { id: message.recipient },
  message: message.messageData as AppsyncFacebookSendMessageData,
  messaging_type: 'MESSAGE_TAG',
  tag: 'ACCOUNT_UPDATE',
});

export const toSendZaloMessagePayload = (
  message: MessageForSend,
): SendZaloMessageRequestPayload => {
  const messageContent: AppsyncZaloSendMessageData = { ...message.messageData };
  return {
    recipient: {
      user_id: message.recipient,
    },
    message: messageContent,
  };
};
