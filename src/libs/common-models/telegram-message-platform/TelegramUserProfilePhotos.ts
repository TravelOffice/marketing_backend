import { PhotoSize } from "./message-contents";

export interface UserProfilePhotos {
    total_count: number;
    photos: PhotoSize[][];
}
