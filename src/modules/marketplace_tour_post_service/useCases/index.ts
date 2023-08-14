import BookmarkPostUseCaseImpl from './BookmarkTourPostUseCaseImpl';
import CreateTourPostUseCaseImpl from './CreateTourPostUseCaseImpl';
import GetTourPostListByOrgUseCaseImpl from './GetTourPostListByOrgUseCaseImpl';
import GetTourPostListUseCaseImpl from './GetTourPostListUseCaseImpl';
import GetTourPostUseCaseImpl from './GetTourPostUseCaseImpl';
import UnbookmarkTourPostUseCaseImpl from './UnbookmarkTourPostUseCaseImpl';
import UpdateTourPostUseCaseImpl from './UpdateTourPostUseCaseImpl';
import { BookmarkTourPostUseCase } from './interfaces/BookmarkTourPostUseCase';
import { CreateTourPostUseCase } from './interfaces/CreateTourPostUseCase';
import { GetTourPostListByOrgUseCase } from './interfaces/GetTourPostListByOrgUseCase';
import { GetSelfTourPostListByUserUseCase } from './interfaces/GetSelfTourPostListByUserUseCase';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { UnbookmarkTourPostUseCase } from './interfaces/UnbookmarkTourPostUseCase';
import { UpdateTourPostUseCase } from './interfaces/UpdateTourPostUseCase';
import { GetTourPostListByUserUseCase } from './interfaces/GetTourPostListByUserUseCase';
import GetTourPostListByUserUseCaseImpl from './GetTourPostListByUserUseCaseImpl';
import GetSelfTourPostListByUserUseCaseImpl from './GetSelfTourPostListByUserUseCaseImpl';
import { FollowTourPostUseCase } from './interfaces/FollowTourPostUseCase';
import FollowTourPostUseCaseImpl from './FollowTourPostUseCaseImpl';
import { UnfollowTourPostUseCase } from './interfaces/UnfollowTourPostUseCase';
import UnfollowTourPostUseCaseImpl from './UnfollowTourPostUseCaseImpl';

interface UseCases {
  getTourPostListUseCase: GetTourPostListUseCase,
  getSelfTourPostListByUserUseCase: GetSelfTourPostListByUserUseCase,
  getTourPostListByUserUseCase: GetTourPostListByUserUseCase,
  getTourPostListByOrgUseCase: GetTourPostListByOrgUseCase,
  createTourPostUseCase: CreateTourPostUseCase,
  getTourPostUseCase: GetTourPostUseCase,
  updateTourPostUseCase: UpdateTourPostUseCase,
  bookmarkTourPostUseCase: BookmarkTourPostUseCase,
  unbookmarkTourPostUseCase: UnbookmarkTourPostUseCase,
  followTourPostUseCase: FollowTourPostUseCase,
  unfollowTourPostUseCase: UnfollowTourPostUseCase,
}

const useCases : UseCases = {
  getTourPostListUseCase: new GetTourPostListUseCaseImpl(),
  getSelfTourPostListByUserUseCase: new GetSelfTourPostListByUserUseCaseImpl(),
  getTourPostListByUserUseCase: new GetTourPostListByUserUseCaseImpl(),
  getTourPostListByOrgUseCase: new GetTourPostListByOrgUseCaseImpl(),
  createTourPostUseCase: new CreateTourPostUseCaseImpl(),
  getTourPostUseCase: new GetTourPostUseCaseImpl(),
  updateTourPostUseCase: new UpdateTourPostUseCaseImpl(),
  bookmarkTourPostUseCase: new BookmarkPostUseCaseImpl(),
  unbookmarkTourPostUseCase: new UnbookmarkTourPostUseCaseImpl(),
  followTourPostUseCase: new FollowTourPostUseCaseImpl(),
  unfollowTourPostUseCase: new UnfollowTourPostUseCaseImpl(),
};

export const {
  getTourPostListUseCase,
  getSelfTourPostListByUserUseCase,
  getTourPostListByUserUseCase,
  getTourPostListByOrgUseCase,
  createTourPostUseCase,
  getTourPostUseCase,
  updateTourPostUseCase,
  bookmarkTourPostUseCase,
  unbookmarkTourPostUseCase,
  followTourPostUseCase,
  unfollowTourPostUseCase,
} = useCases;
