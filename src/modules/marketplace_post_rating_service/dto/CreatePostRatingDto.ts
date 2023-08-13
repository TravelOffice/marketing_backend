import { PostRating } from '../models/PostRating';

export type CreatePostRatingDto = Pick<PostRating, 'star' | 'description'>;
