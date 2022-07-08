import { PhotoSize } from '../message-contents';

export interface UserProfilePhotos {
  total_count: number;
  photos: PhotoSize[][];
}

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string | undefined;
  username?: string | undefined;
  language_code?: string | undefined;
}
