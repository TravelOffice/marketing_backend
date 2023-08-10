// TODO: Declare repository objects which can be used in this service here

import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { TourPostRepository } from './interfaces/TourPostRepository';

interface Repositories {
  tourPostRepository: TourPostRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
}

const repositories : Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  tourPostRepository,
  marketplaceUserRepository,
} = repositories;
