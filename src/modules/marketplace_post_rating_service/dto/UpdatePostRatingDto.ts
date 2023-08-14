import { PostRating } from '../models/PostRating';

export type UpdatePostRatingDto = Pick<PostRating, 'code' | 'tourPostId' | 'organizationId' | 'star' | 'description'>;
