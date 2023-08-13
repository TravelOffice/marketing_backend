// TODO: Declare repository objects which can be used in this service here

import PostRatingRepositoryImpl from './PostRatingRepositoryImpl';
import { PostRatingRepository } from './interfaces/PostRatingRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';

interface Repositories {
  postRatingRepository: PostRatingRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
}

const repositories: Repositories = {
  postRatingRepository: new PostRatingRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
};

export const {
  postRatingRepository,
  marketplaceUserRepository,
} = repositories;
