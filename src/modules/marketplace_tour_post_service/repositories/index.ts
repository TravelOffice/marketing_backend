import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import TourPostStatisticRepositoryImpl from './TourPostStatisticRepositoryImpl';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { TourPostRepository } from './interfaces/TourPostRepository';
import { TourPostStatisticRepository } from './interfaces/TourPostStatisticRepository';

interface Repositories {
  tourPostRepository: TourPostRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  tourPostStatisticRepository: TourPostStatisticRepository,
}

const repositories : Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  tourPostStatisticRepository: new TourPostStatisticRepositoryImpl(),
};

export const {
  tourPostRepository,
  marketplaceUserRepository,
  tourPostStatisticRepository,
} = repositories;
