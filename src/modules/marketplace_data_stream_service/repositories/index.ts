import MarketplaceStatisticRepositoryImpl from './MarketplaceStatisticRepositoryImpl';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import OrganizationStatisticRepositoryImpl from './OrganizationStatisticRepositoryImpl';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import TourPostStatisticRepositoryImpl from './TourPostStatisticRepositoryImpl';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { OrganizationStatisticRepository } from './interfaces/OrganizationStatisticRepository';
import { TourPostRepository } from './interfaces/TourPostRepository';
import { TourPostStatisticRepository } from './interfaces/TourPostStatisticRepository';

interface Repositories {
  tourPostRepository: TourPostRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  marketplaceStatisticRepository: MarketplaceStatisticRepository,
  organizationStatisticRepository: OrganizationStatisticRepository,
  tourPostStatisticRepository: TourPostStatisticRepository,
}

const repositories: Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  marketplaceStatisticRepository: new MarketplaceStatisticRepositoryImpl(),
  organizationStatisticRepository: new OrganizationStatisticRepositoryImpl(),
  tourPostStatisticRepository: new TourPostStatisticRepositoryImpl(),
};

export const {
  tourPostRepository,
  marketplaceUserRepository,
  marketplaceStatisticRepository,
  organizationStatisticRepository,
  tourPostStatisticRepository,
} = repositories;
