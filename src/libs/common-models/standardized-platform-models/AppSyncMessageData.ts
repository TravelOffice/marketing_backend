import { FacebookMessageContent } from '../facebook-message-platform';
import { Optional } from 'utility-types';
import { ZaloMessageContent } from '../zalo-message-platform';

export type AppsyncFacebookMessageData = Optional<FacebookMessageContent, 'mid'>;
export type AppsyncZaloMessageData = Optional<ZaloMessageContent, 'msg_id'>;

export type AppSyncMessageData = AppsyncFacebookMessageData | AppsyncZaloMessageData;