import MarketplaceStatisticRepositoryImpl from './MarketplaceStatisticRepositoryImpl';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { TourPostRepository } from './interfaces/TourPostRepository';

interface Repositories {
  tourPostRepository: TourPostRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  marketplaceStatisticRepository: MarketplaceStatisticRepository,
}

const repositories : Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  marketplaceStatisticRepository: new MarketplaceStatisticRepositoryImpl(),
};

export const {
  tourPostRepository,
  marketplaceUserRepository,
  marketplaceStatisticRepository,
} = repositories;
