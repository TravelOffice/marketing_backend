import { PostComment } from '../models/PostComment';

export type CreatePostCommentDto = Pick<PostComment, 'description'>;
