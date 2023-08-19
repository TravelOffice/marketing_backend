import { PostRating } from '../models/PostRating';

export type UpdatePostRatingDto = Pick<PostRating, 'code' | 'tourPostId' | 'organization' | 'star' | 'description'>;
