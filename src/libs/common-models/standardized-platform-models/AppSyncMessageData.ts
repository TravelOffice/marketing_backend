import { FacebookMessageContent } from '../facebook-message-platform';
import { Optional } from 'utility-types';
import { ZaloReceivedMessageContent } from '../zalo-message-platform';
import { ZaloSendMessageContent } from '../zalo-message-platform';

export type AppSyncFacebookMessageData = Optional<FacebookMessageContent, 'mid'>;
export type AppSyncZaloReceivedMessageData = Optional<ZaloReceivedMessageContent, 'msg_id'>;
export type AppsyncZaloSendMessageData = Optional<ZaloSendMessageContent>;

export type AppSyncMessageData = AppSyncFacebookMessageData | AppSyncZaloReceivedMessageData;
