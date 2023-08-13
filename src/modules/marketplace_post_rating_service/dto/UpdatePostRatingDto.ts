import { PostRating } from '../models/PostRating';

export type UpdatePostRatingDto = Pick<PostRating, 'star' | 'description'>;
