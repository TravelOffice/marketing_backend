import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { PostRating, PostRatingResponsePayload } from '../../models/PostRating';

export interface PostRatingRepository {
  listByPost(
    postId: string,
    paginationParams: PaginationParams,
  ): Promise<PostRatingResponsePayload | undefined>,

  create(rating: PostRating): Promise<PostRating>,

  get(tourPostId: string, id: string): Promise<PostRating | undefined>,

  update(tourPostId: string, id: string, rating: Partial<PostRating>): Promise<PostRating>,

  delete(tourPostId: string, id: string): Promise<void>,

  generateCode(): Promise<string>,
}
