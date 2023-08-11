// TODO: Declare use cases which can be used in this service here

import CreateTourPostUseCaseImpl from './CreateTourPostUseCaseImpl';
import GetTourPostListUseCaseImpl from './GetTourPostListUseCaseImpl';
import GetTourPostUseCaseImpl from './GetTourPostUseCaseImpl';
import { CreateTourPostUseCase } from './interfaces/CreateTourPostUseCase';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { BookmarkTourPostUseCase } from './interfaces/BookmarkTourPostUseCase';
import { UpdateTourPostUseCase } from './interfaces/UpdateTourPostUseCase';
import BookmarkPostUseCaseImpl from './BookmarkTourPostUseCaseImpl';
import UpdateTourPostUseCaseImpl from './UpdateTourPostUseCaseImpl';
import { UnbookmarkTourPostUseCase } from './interfaces/UnbookmarkTourPostUseCase';
import UnbookmarkPostUseCaseImpl from './UnbookmarkTourPostUseCaseImpl';

interface UseCases {
  getTourPostListUseCase: GetTourPostListUseCase,
  createTourPostUseCase: CreateTourPostUseCase,
  getTourPostUseCase: GetTourPostUseCase,
  updateTourPostUseCase: UpdateTourPostUseCase,
  bookmarkTourPostUseCase: BookmarkTourPostUseCase,
  unbookmarkTourPostUseCase: UnbookmarkTourPostUseCase,
}

const useCases : UseCases = {
  getTourPostListUseCase: new GetTourPostListUseCaseImpl(),
  createTourPostUseCase: new CreateTourPostUseCaseImpl(),
  getTourPostUseCase: new GetTourPostUseCaseImpl(),
  updateTourPostUseCase: new UpdateTourPostUseCaseImpl(),
  bookmarkTourPostUseCase: new BookmarkPostUseCaseImpl(),
  unbookmarkTourPostUseCase: new UnbookmarkPostUseCaseImpl(),
};

export const {
  getTourPostListUseCase,
  createTourPostUseCase,
  getTourPostUseCase,
  updateTourPostUseCase,
  bookmarkTourPostUseCase,
  unbookmarkTourPostUseCase,
} = useCases;
