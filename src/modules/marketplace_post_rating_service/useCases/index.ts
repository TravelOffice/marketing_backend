// TODO: Declare use cases which can be used in this service here

import CreatePostRatingUseCaseImpl from './CreatePostRatingUseCaseImpl';
import DeletePostRatingUseCaseImpl from './DeletePostRatingUseCaseImpl';
import GetPostRatingListUseCaseImpl from './GetPostRatingListUseCaseImpl';
import GetPostRatingUseCaseImpl from './GetPostRatingUseCaseImpl';
import { CreatePostRatingUseCase } from './interfaces/CreatePostRatingUseCase';
import { DeletePostRatingUseCase } from './interfaces/DeletePostRatingUseCase';
import { GetPostRatingListUseCase } from './interfaces/GetPostRatingListUseCase';
import { GetPostRatingUseCase } from './interfaces/GetPostRatingUseCase';
import { UpdatePostRatingUseCase } from './interfaces/UpdatePostRatingUseCase';
import UpdatePostRatingUseCaseImpl from './UpdatePostRatingUseCaseImpl';

interface UseCases {
  getPostRatingListUseCase: GetPostRatingListUseCase,
  createPostRatingUseCase: CreatePostRatingUseCase,
  getPostRatingUseCase: GetPostRatingUseCase,
  updatePostRatingUseCase: UpdatePostRatingUseCase,
  deletePostRatingUseCase: DeletePostRatingUseCase,
}

const useCases: UseCases = {
  getPostRatingListUseCase: new GetPostRatingListUseCaseImpl(),
  createPostRatingUseCase: new CreatePostRatingUseCaseImpl(),
  getPostRatingUseCase: new GetPostRatingUseCaseImpl(),
  updatePostRatingUseCase: new UpdatePostRatingUseCaseImpl(),
  deletePostRatingUseCase: new DeletePostRatingUseCaseImpl(),
};

export const {
  getPostRatingListUseCase,
  createPostRatingUseCase,
  getPostRatingUseCase,
  updatePostRatingUseCase,
  deletePostRatingUseCase,
} = useCases;
