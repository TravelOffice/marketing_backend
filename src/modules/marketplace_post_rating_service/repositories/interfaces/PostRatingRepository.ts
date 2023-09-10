import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { PostRating } from '../../models/PostRating';

export interface PostRatingRepository {
  listByPost(organization: string, tourPostId: string): Promise<PostRating[]>,

  listByOrganization(
    organization: string,
    paginationParams: PaginationParams,
    numberStar?: string,
  ): Promise<PaginationResponsePayload<PostRating> | undefined>,

  create(rating: PostRating): Promise<PostRating>,

  get(organization: string, tourPostId: string, id: string): Promise<PostRating | undefined>,

  getByUserId(
    organization: string,
    tourPostId: string,
    userId: string,
  ): Promise<PostRating | undefined>,

  update(
    organization: string,
    tourPostId: string,
    id: string,
    rating: Partial<PostRating>
  ): Promise<PostRating>,

  delete(organization: string, tourPostId: string, id: string): Promise<void>,

  generateCode(): Promise<string>,
}
