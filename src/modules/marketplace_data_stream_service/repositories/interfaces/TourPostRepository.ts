import { TourPost } from '../../models/TourPost';

export interface TourPostRepository {
  getById(id: string): Promise<TourPost | undefined>,
}
