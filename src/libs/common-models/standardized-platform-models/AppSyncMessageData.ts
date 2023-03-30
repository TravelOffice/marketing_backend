// eslint-disable-next-line import/no-extraneous-dependencies
import { Optional } from 'utility-types';
import { FacebookWebhookMessageContent, FacebookSendMessageContent } from '../facebook-message-platform';
import { ZaloReceivedMessageContent, ZaloSendMessageContent } from '../zalo-message-platform';
import { TelegramMessageContent } from '../telegram-message-platform';

export type AppSyncFacebookReceivedMessageData = Optional<FacebookWebhookMessageContent, 'mid'>;
export type AppSyncZaloReceivedMessageData = Optional<ZaloReceivedMessageContent, 'msg_id'>;
export type AppSyncTelegramReceivedMessageData = Optional<TelegramMessageContent, 'message_id'>;

export type AppsyncZaloSendMessageData = Optional<ZaloSendMessageContent>;
export type AppsyncFacebookSendMessageData = FacebookSendMessageContent;

export type AppSyncReceiveMessageData =
  AppSyncFacebookReceivedMessageData | AppSyncZaloReceivedMessageData | AppSyncTelegramReceivedMessageData;

export type AppSyncSendMessageData =
  AppsyncZaloSendMessageData | AppsyncFacebookSendMessageData;
