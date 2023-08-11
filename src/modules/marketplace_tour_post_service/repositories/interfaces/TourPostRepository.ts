import { TourPost } from '../../models/TourPost';

export interface TourPostRepository {
  list(nextToken?: string, limit?: number): Promise<Array<TourPost>>,
  create(tourPost: TourPost): Promise<TourPost>,
  getById(id: string): Promise<TourPost | undefined>,
  update(id: string, tourPost: Partial<TourPost>): Promise<TourPost>,
  generateCode(): Promise<string>,
}
