import BookmarkPostUseCaseImpl from './BookmarkTourPostUseCaseImpl';
import CreateTourPostUseCaseImpl from './CreateTourPostUseCaseImpl';
import FollowTourPostUseCaseImpl from './FollowTourPostUseCaseImpl';
import GetBookmarkedTourPostsUseCaseImpl from './GetBookmarkedTourPostsUseCaseImpl';
import GetFollowedTourPostsUseCaseImpl from './GetFollowedTourPostsUseCaseImpl';
import GetLinkedLeadOrTourInfoOnMarketplaceUseCaseImpl from './GetLinkedLeadOrTourInfoOnMarketplaceUseCaseImpl';
import GetSelfTourPostListByUserUseCaseImpl from './GetSelfTourPostListByUserUseCaseImpl';
import GetTopCommissionPostsUseCaseImpl from './GetTopCommissionPostsUseCaseImpl';
import GetTourPostListByOrgUseCaseImpl from './GetTourPostListByOrgUseCaseImpl';
import GetTourPostListByUserUseCaseImpl from './GetTourPostListByUserUseCaseImpl';
import GetTourPostListUseCaseImpl from './GetTourPostListUseCaseImpl';
import GetTourPostUseCaseImpl from './GetTourPostUseCaseImpl';
import UnbookmarkTourPostUseCaseImpl from './UnbookmarkTourPostUseCaseImpl';
import UnfollowTourPostUseCaseImpl from './UnfollowTourPostUseCaseImpl';
import UpdateTourPostUseCaseImpl from './UpdateTourPostUseCaseImpl';
import { BookmarkTourPostUseCase } from './interfaces/BookmarkTourPostUseCase';
import { CreateTourPostUseCase } from './interfaces/CreateTourPostUseCase';
import { FollowTourPostUseCase } from './interfaces/FollowTourPostUseCase';
import { GetBookmarkedTourPostsUseCase } from './interfaces/GetBookmarkedTourPostsUseCase';
import { GetFollowedTourPostsUseCase } from './interfaces/GetFollowedTourPostsUseCase';
import {
  GetLinkedLeadOrTourInfoOnMarketplaceUseCase,
} from './interfaces/GetLinkedLeadOrTourInfoOnMarketplace';
import { GetSelfTourPostListByUserUseCase } from './interfaces/GetSelfTourPostListByUserUseCase';
import { GetTopCommissionPostsUseCase } from './interfaces/GetTopCommissionPostsUseCase';
import { GetTourPostListByOrgUseCase } from './interfaces/GetTourPostListByOrgUseCase';
import { GetTourPostListByUserUseCase } from './interfaces/GetTourPostListByUserUseCase';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';
import { GetTourPostUseCase } from './interfaces/GetTourPostUseCase';
import { UnbookmarkTourPostUseCase } from './interfaces/UnbookmarkTourPostUseCase';
import { UnfollowTourPostUseCase } from './interfaces/UnfollowTourPostUseCase';
import { UpdateTourPostUseCase } from './interfaces/UpdateTourPostUseCase';
import { GetTourPostListByPostTypeUseCase } from './interfaces/GetTourPostListByPostTypeUseCase';
import GetTourPostListByPostTypeUseCaseImpl from './GetTourPostListByPostTypeUseCaseImpl';

interface UseCases {
  getTourPostListUseCase: GetTourPostListUseCase,
  getSelfTourPostListByUserUseCase: GetSelfTourPostListByUserUseCase,
  getTourPostListByUserUseCase: GetTourPostListByUserUseCase,
  getTourPostListByPostTypeUseCase: GetTourPostListByPostTypeUseCase,
  getTourPostListByOrgUseCase: GetTourPostListByOrgUseCase,
  getBookmarkedTourPostsUseCase: GetBookmarkedTourPostsUseCase,
  getFollowedTourPostsUseCase: GetFollowedTourPostsUseCase,
  createTourPostUseCase: CreateTourPostUseCase,
  getTourPostUseCase: GetTourPostUseCase,
  updateTourPostUseCase: UpdateTourPostUseCase,
  bookmarkTourPostUseCase: BookmarkTourPostUseCase,
  unbookmarkTourPostUseCase: UnbookmarkTourPostUseCase,
  followTourPostUseCase: FollowTourPostUseCase,
  unfollowTourPostUseCase: UnfollowTourPostUseCase,
  getTopCommissionPostsUseCase: GetTopCommissionPostsUseCase,
  getLinkedLeadOrTourInfoOnMarketplaceUseCase: GetLinkedLeadOrTourInfoOnMarketplaceUseCase,
}

const useCases: UseCases = {
  getTourPostListUseCase: new GetTourPostListUseCaseImpl(),
  getSelfTourPostListByUserUseCase: new GetSelfTourPostListByUserUseCaseImpl(),
  getTourPostListByUserUseCase: new GetTourPostListByUserUseCaseImpl(),
  getTourPostListByPostTypeUseCase: new GetTourPostListByPostTypeUseCaseImpl(),
  getTourPostListByOrgUseCase: new GetTourPostListByOrgUseCaseImpl(),
  getBookmarkedTourPostsUseCase: new GetBookmarkedTourPostsUseCaseImpl(),
  getFollowedTourPostsUseCase: new GetFollowedTourPostsUseCaseImpl(),
  createTourPostUseCase: new CreateTourPostUseCaseImpl(),
  getTourPostUseCase: new GetTourPostUseCaseImpl(),
  updateTourPostUseCase: new UpdateTourPostUseCaseImpl(),
  bookmarkTourPostUseCase: new BookmarkPostUseCaseImpl(),
  unbookmarkTourPostUseCase: new UnbookmarkTourPostUseCaseImpl(),
  followTourPostUseCase: new FollowTourPostUseCaseImpl(),
  unfollowTourPostUseCase: new UnfollowTourPostUseCaseImpl(),
  getTopCommissionPostsUseCase: new GetTopCommissionPostsUseCaseImpl(),
  getLinkedLeadOrTourInfoOnMarketplaceUseCase:
    new GetLinkedLeadOrTourInfoOnMarketplaceUseCaseImpl(),
};

export const {
  getTourPostListUseCase,
  getSelfTourPostListByUserUseCase,
  getTourPostListByUserUseCase,
  getTourPostListByPostTypeUseCase,
  getTourPostListByOrgUseCase,
  getBookmarkedTourPostsUseCase,
  getFollowedTourPostsUseCase,
  createTourPostUseCase,
  getTourPostUseCase,
  updateTourPostUseCase,
  bookmarkTourPostUseCase,
  unbookmarkTourPostUseCase,
  followTourPostUseCase,
  unfollowTourPostUseCase,
  getTopCommissionPostsUseCase,
  getLinkedLeadOrTourInfoOnMarketplaceUseCase,
} = useCases;
