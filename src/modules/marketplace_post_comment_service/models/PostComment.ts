import { PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BaseDdbModel } from 'common-models';

export interface PostComment extends BaseDdbModel {
  code: string, // Auto-generated code from DynamoDB
  description?: string, // Description of the tour post
  tourPostId: string, // The ID of the tour post
  authorId: string, // Alias id of marketplace user that is auto-generated or set by user
}

export interface PostCommentResponsePayload extends PaginationResponsePayload {
  data: PostComment[],
}
