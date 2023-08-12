// TODO: Declare use cases which can be used in this service here

import CreatePostCommentUseCaseImpl from './CreatePostCommentUseCaseImpl';
import DeletePostCommentUseCaseImpl from './DeletePostCommentUseCaseImpl';
import GetPostCommentListUseCaseImpl from './GetPostCommentListUseCaseImpl';
import GetPostCommentUseCaseImpl from './GetPostCommentUseCaseImpl';
import { CreatePostCommentUseCase } from './interfaces/CreatePostCommentUseCase';
import { DeletePostCommentUseCase } from './interfaces/DeletePostCommentUseCase';
import { GetPostCommentListUseCase } from './interfaces/GetPostCommentListUseCase';
import { GetPostCommentUseCase } from './interfaces/GetPostCommentUseCase';
import { UpdatePostCommentUseCase } from './interfaces/UpdatePostCommentUseCase';
import UpdatePostCommentUseCaseImpl from './UpdatePostCommentUseCaseImpl';

interface UseCases {
  getPostCommentListUseCase: GetPostCommentListUseCase,
  createPostCommentUseCase: CreatePostCommentUseCase,
  getPostCommentUseCase: GetPostCommentUseCase,
  updatePostCommentUseCase: UpdatePostCommentUseCase,
  deletePostCommentUseCase: DeletePostCommentUseCase,
}

const useCases: UseCases = {
  getPostCommentListUseCase: new GetPostCommentListUseCaseImpl(),
  createPostCommentUseCase: new CreatePostCommentUseCaseImpl(),
  getPostCommentUseCase: new GetPostCommentUseCaseImpl(),
  updatePostCommentUseCase: new UpdatePostCommentUseCaseImpl(),
  deletePostCommentUseCase: new DeletePostCommentUseCaseImpl(),
};

export const {
  getPostCommentListUseCase,
  createPostCommentUseCase,
  getPostCommentUseCase,
  updatePostCommentUseCase,
  deletePostCommentUseCase,
} = useCases;
