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
import { GetOrgRatingListUseCase } from './interfaces/GetOrgRatingListUseCase';
import GetOrgRatingListUseCaseImpl from './GetOrgRatingListUseCaseImpl';

interface UseCases {
  getPostRatingListUseCase: GetPostRatingListUseCase,
  getOrgRatingListUseCase: GetOrgRatingListUseCase,
  createPostRatingUseCase: CreatePostRatingUseCase,
  getPostRatingUseCase: GetPostRatingUseCase,
  updatePostRatingUseCase: UpdatePostRatingUseCase,
  deletePostRatingUseCase: DeletePostRatingUseCase,
}

const useCases: UseCases = {
  getPostRatingListUseCase: new GetPostRatingListUseCaseImpl(),
  getOrgRatingListUseCase: new GetOrgRatingListUseCaseImpl(),
  createPostRatingUseCase: new CreatePostRatingUseCaseImpl(),
  getPostRatingUseCase: new GetPostRatingUseCaseImpl(),
  updatePostRatingUseCase: new UpdatePostRatingUseCaseImpl(),
  deletePostRatingUseCase: new DeletePostRatingUseCaseImpl(),
};

export const {
  getPostRatingListUseCase,
  getOrgRatingListUseCase,
  createPostRatingUseCase,
  getPostRatingUseCase,
  updatePostRatingUseCase,
  deletePostRatingUseCase,
} = useCases;
