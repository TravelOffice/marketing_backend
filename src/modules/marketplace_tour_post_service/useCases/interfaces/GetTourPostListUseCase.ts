import { TourPost } from '../../models/TourPost';

export interface GetTourPostListUseCase {
  invoke(nextToken?: string, limit?: number): Promise<Array<TourPost>>,
}
