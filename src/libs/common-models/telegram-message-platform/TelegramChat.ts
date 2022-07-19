import { ChatType } from './TelegramTypes';
import { TelegramMessage } from './TelegramMessage';

export interface ChatPhoto {
  small_file_id: string;
  big_file_id: string;
}

export interface ChatPermissions {
  can_send_messages?: boolean;
  can_send_media_messages?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
}

export interface TelegramChat {
  id: number;
  type: ChatType;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo?: ChatPhoto;
  description?: string;
  invite_link?: string;
  pinned_message?: TelegramMessage;
  permissions?: ChatPermissions;
  can_set_sticker_set?: boolean;
  sticker_set_name?: string;
  has_private_forwards?: boolean;
  has_protected_content?: boolean;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  linked_chat_id?: number;
  /**
   * @deprecated since version Telegram Bot API 4.4 - July 29, 2019
   */
  all_members_are_administrators?: boolean;
}
