// TODO: Declare repository objects which can be used in this service here

import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import { TourPostRepository } from './interfaces/TourPostRepository';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import { OfferRepository } from './interfaces/OfferRepository';
import OfferRepositoryImpl from './OfferRepositoryImpl';

interface Repositories {
  tourPostRepository: TourPostRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  offerRepository: OfferRepository,
}

const repositories: Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  offerRepository: new OfferRepositoryImpl(),
};

export const {
  tourPostRepository,
  marketplaceUserRepository,
  offerRepository,
} = repositories;
