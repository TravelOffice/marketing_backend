import { PostComment } from '../models/PostComment';

export type UpdatePostCommentDto = Pick<PostComment, 'description'>;
