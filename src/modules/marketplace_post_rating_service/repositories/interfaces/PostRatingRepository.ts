import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { PostRating } from '../../models/PostRating';

export interface PostRatingRepository {
  listByPost(organizationId: string, tourPostId: string): Promise<PostRating[]>,

  listByOrganization(
    organizationId: string,
    paginationParams: PaginationParams,
    numberStar?: string,
  ): Promise<PaginationResponsePayload<PostRating> | undefined>,

  create(rating: PostRating): Promise<PostRating>,

  get(organizationId: string, tourPostId: string, id: string): Promise<PostRating | undefined>,

  update(
    organizationId: string,
    tourPostId: string,
    id: string,
    rating: Partial<PostRating>
  ): Promise<PostRating>,

  delete(organizationId: string, tourPostId: string, id: string): Promise<void>,

  generateCode(): Promise<string>,
}
