import { TourPost } from '../../models/TourPost';

export interface GetTopCommissionPostsUseCase {
  invoke(topCount?: number): Promise<TourPost[]>;
}
