import { ChatType } from './TelegramTypes';
import { Message } from './TelegramMessage';

export interface ChatPhoto {
  small_file_id: string;
  big_file_id: string;
}

export interface ChatPermissions {
  can_send_messages?: boolean | undefined;
  can_send_media_messages?: boolean | undefined;
  can_send_polls?: boolean | undefined;
  can_send_other_messages?: boolean | undefined;
  can_add_web_page_previews?: boolean | undefined;
  can_change_info?: boolean | undefined;
  can_invite_users?: boolean | undefined;
  can_pin_messages?: boolean | undefined;
}

export interface Chat {
  id: number;
  type: ChatType;
  title?: string | undefined;
  username?: string | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
  photo?: ChatPhoto | undefined;
  description?: string | undefined;
  invite_link?: string | undefined;
  pinned_message?: Message | undefined;
  permissions?: ChatPermissions | undefined;
  can_set_sticker_set?: boolean | undefined;
  sticker_set_name?: string | undefined;
  has_private_forwards?: boolean | undefined;
  has_protected_content?: boolean | undefined;
  slow_mode_delay?: number | undefined;
  message_auto_delete_time?: number | undefined;
  linked_chat_id?: number | undefined;
  /**
   * @deprecated since version Telegram Bot API 4.4 - July 29, 2019
   */
  all_members_are_administrators?: boolean | undefined;
}
