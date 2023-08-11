import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BookmarkedTourPost } from '../../models/BookmarkedTourPost';
import { TourPost } from '../../models/TourPost';

export interface TourPostRepository {
  listByUser(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
  listByOrganization(
    organizationId: string,
    params: PaginationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
  create(tourPost: TourPost): Promise<TourPost>,
  getById(id: string): Promise<TourPost | undefined>,
  update(id: string, tourPost: Partial<TourPost>): Promise<TourPost>,
  getAllBookmarkedItems(userId: string): Promise<Array<BookmarkedTourPost>>,
  getBookmarkedItem(userId: string, tourPostId: string): Promise<BookmarkedTourPost | undefined>,
  bookmark(userId: string, tourPostId: string): Promise<Partial<BookmarkedTourPost>>,
  unbookmark(userId: string, tourPostId: string): Promise<void>,
  generateCode(): Promise<string>,
}
