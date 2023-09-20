import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BookmarkedTourPost } from '../../models/BookmarkedTourPost';
import { FollowedTourPost } from '../../models/FollowedTourPost';
import { TourPost } from '../../models/TourPost';
import { TourPostStatus } from '../../models/TourPostStatus';

export interface TourPostRepository {
  // CRUD functions
  list(
    currentUserId: string,
    params: PaginationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listByUser(
    currentUserId: string,
    author: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listByPostType(
    currentUserId: string,
    postType: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listByOrganization(
    currentUserId: string,
    organization: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listBookmarkedByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listFollowedByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listByEndingLocation(
    currentUserid: string,
    endingLocation: string,
    paginationParams: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listByDepartureDate(
    currentUserId: string,
    departureDate: string,
    paginationParams: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,

  listByIds(ids: string[]): Promise<Array<TourPost>>,

  create(tourPost: TourPost): Promise<TourPost>,

  getById(id: string, userId?: string): Promise<TourPost | undefined>,

  update(id: string, tourPost: Partial<TourPost>): Promise<TourPost>,

  // Bookmark functions
  getAllBookmarkedItems(userId: string): Promise<Array<BookmarkedTourPost>>,

  getBookmarkedItem(userId: string, tourPostId: string): Promise<BookmarkedTourPost | undefined>,

  bookmark(userId: string, tourPostId: string): Promise<Partial<BookmarkedTourPost>>,

  unbookmark(userId: string, tourPostId: string): Promise<void>,

  // Followed functions
  getAllFollowedItems(userId: string): Promise<Array<FollowedTourPost>>,

  getFollowedItem(userId: string, tourPostId: string): Promise<FollowedTourPost | undefined>,

  follow(userId: string, tourPostId: string): Promise<Partial<FollowedTourPost>>,

  unfollow(userId: string, tourPostId: string): Promise<void>,

  generateCode(): Promise<string>,

  deleteThumbnail(cdnUrl?: string): Promise<void>,
}
