import { PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BaseDdbModel } from 'common-models';

export interface PostRating extends BaseDdbModel {
  code: string, // Auto-generated code from DynamoDB
  star: number, // Number of start
  description?: string, // Description of the tour post
  tourPostId: string, // The ID of the tour post
  authorId: string, // Alias id of marketplace user that is auto-generated or set by user
}

export interface PostRatingResponsePayload extends PaginationResponsePayload {
  data: PostRating[],
}
