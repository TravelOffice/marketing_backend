import { ChatPlatform } from '../graphql-models';
import { User } from './TelegramUser';

export interface TelegramBot extends User {
  name: string,
  can_join_groups: boolean,
  can_read_all_group_messages: boolean,
  supports_inline_queries: boolean,
  platform: ChatPlatform.telegram,
  accessToken: string, // Telegram bot token api
  secretToken: string, // To ensure that the request comes from a webhook set by you
}
