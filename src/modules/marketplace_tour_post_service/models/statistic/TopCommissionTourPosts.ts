import { TourPost } from '../TourPost';

export type TopCommissionTourPost = Pick<
  TourPost,
  'pk' | 'sk' | 'commission' | 'createdAt' | 'updatedAt'
> & {
  keys: Pick<TourPost, 'pk' | 'sk'>
};

export type TopCommissionTourPosts = TopCommissionTourPost[];
