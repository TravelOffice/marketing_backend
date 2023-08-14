// TODO: Declare repository objects which can be used in this service here

import PostRatingRepositoryImpl from './PostRatingRepositoryImpl';
import { PostRatingRepository } from './interfaces/PostRatingRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import { TourPostRepository } from './interfaces/TourPostRepository';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';

interface Repositories {
  tourPostRepository: TourPostRepository,
  postRatingRepository: PostRatingRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
}

const repositories: Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  postRatingRepository: new PostRatingRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
};

export const {
  tourPostRepository,
  postRatingRepository,
  marketplaceUserRepository,
} = repositories;
