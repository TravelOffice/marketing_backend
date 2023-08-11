import { TourPost } from '../../models/TourPost';

export interface GetTourPostUseCase {
  invoke(tourPostId: string): Promise<TourPost>,
}
