// TODO: Declare repository objects which can be used in this service here

import PostRatingRepositoryImpl from './PostRatingRepositoryImpl';
import { PostRatingRepository } from './interfaces/PostRatingRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import { TourPostRepository } from './interfaces/TourPostRepository';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import { OfferRepository } from './interfaces/OfferRepository';
import OfferRepositoryImpl from './OfferRepositoryImpl';

interface Repositories {
  tourPostRepository: TourPostRepository,
  postRatingRepository: PostRatingRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  offerRepository: OfferRepository,
}

const repositories: Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  postRatingRepository: new PostRatingRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  offerRepository: new OfferRepositoryImpl(),
};

export const {
  tourPostRepository,
  postRatingRepository,
  marketplaceUserRepository,
  offerRepository,
} = repositories;
