import { Optional } from 'utility-types';
import { FacebookMessageContent, FacebookSendMessageContent } from '../facebook-message-platform';
import { ZaloReceivedMessageContent, ZaloSendMessageContent } from '../zalo-message-platform';

export type AppSyncFacebookReceivedMessageData = Optional<FacebookMessageContent, 'mid'>;
export type AppSyncZaloReceivedMessageData = Optional<ZaloReceivedMessageContent, 'msg_id'>;

export type AppsyncZaloSendMessageData = Optional<ZaloSendMessageContent>;
export type AppsyncFacebookSendMessageData = FacebookSendMessageContent;

export type AppSyncReceiveMessageData = AppSyncFacebookReceivedMessageData | AppSyncZaloReceivedMessageData;
export type AppSyncSendMessageData = AppsyncZaloSendMessageData | AppsyncFacebookSendMessageData;