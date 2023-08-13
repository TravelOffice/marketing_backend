import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BookmarkedTourPost } from '../../models/BookmarkedTourPost';
import { TourPost } from '../../models/TourPost';
import { FollowedTourPost } from '../../models/FollowedTourPost';

export interface TourPostRepository {
  // CRUD functions
  list(
    currentUserId: string,
    params: PaginationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
  listByUser(
    currentUserId: string,
    author: string,
    params: PaginationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
  listByOrganization(
    currentUserId: string,
    organizationId: string,
    params: PaginationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
  create(tourPost: TourPost): Promise<TourPost>,
  getById(id: string): Promise<TourPost | undefined>,
  update(id: string, tourPost: Partial<TourPost>): Promise<TourPost>,

  // Bookmark functions
  getAllBookmarkedItems(userId: string): Promise<Array<BookmarkedTourPost>>,
  getBookmarkedItem(userId: string, tourPostId: string): Promise<BookmarkedTourPost | undefined>,
  bookmark(userId: string, tourPostId: string): Promise<Partial<BookmarkedTourPost>>,
  unbookmark(userId: string, tourPostId: string): Promise<void>,

  // Favoutite functions
  getAllFollowedItems(userId: string): Promise<Array<FollowedTourPost>>,
  getFollowedItem(userId: string, tourPostId: string): Promise<FollowedTourPost | undefined>,
  follow(userId: string, tourPostId: string): Promise<Partial<FollowedTourPost>>,
  unfollow(userId: string, tourPostId: string): Promise<void>,

  generateCode(): Promise<string>,
}
