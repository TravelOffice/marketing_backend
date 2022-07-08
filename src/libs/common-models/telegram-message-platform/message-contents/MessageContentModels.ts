import { MessageEntityType } from '../TelegramTypes';
import { PhotoSize } from './FileBasedModels';
import { User } from '../TelegramUser';

/// MESSAGE CONTENT MODELS ///
export interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string | undefined;
  text_entities?: MessageEntity[] | undefined;
  animation?: Animation | undefined;
}

export interface MaskPosition {
  point: string;
  x_shift: number;
  y_shift: number;
  scale: number;
}

export interface Sticker {
  file_id: string;
  file_unique_id: string;
  is_animated: boolean;
  width: number;
  height: number;
  thumb?: PhotoSize | undefined;
  emoji?: string | undefined;
  set_name?: string | undefined;
  mask_position?: MaskPosition | undefined;
  file_size?: number | undefined;
}

export interface Contact {
  phone_number: string;
  first_name: string;
  last_name?: string | undefined;
  user_id?: number | undefined;
  vcard?: string | undefined;
}

export interface Dice {
  emoji: string;
  value: number;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface Venue {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string | undefined;
  foursquare_type?: string | undefined;
}

type PollType = 'regular' | 'quiz';

interface PollOption {
  text: string;
  voter_count: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  is_closed: boolean;
  is_anonymous: boolean;
  allows_multiple_answers: boolean;
  type: PollType;
  total_voter_count: number;
}

export interface MessageEntity {
  type: MessageEntityType;
  offset: number;
  length: number;
  url?: string | undefined;
  user?: User | undefined;
  language?: string | undefined;
}
