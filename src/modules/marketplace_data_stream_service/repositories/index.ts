import MarketplaceStatisticRepositoryImpl from './MarketplaceStatisticRepositoryImpl';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import OrganizationStatisticRepositoryImpl from './OrganizationStatisticRepositoryImpl';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { OrganizationStatisticRepository } from './interfaces/OrganizationStatisticRepository';
import { TourPostRepository } from './interfaces/TourPostRepository';

interface Repositories {
  tourPostRepository: TourPostRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  marketplaceStatisticRepository: MarketplaceStatisticRepository,
  organizationStatisticRepository: OrganizationStatisticRepository,
}

const repositories : Repositories = {
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  marketplaceStatisticRepository: new MarketplaceStatisticRepositoryImpl(),
  organizationStatisticRepository: new OrganizationStatisticRepositoryImpl(),
};

export const {
  tourPostRepository,
  marketplaceUserRepository,
  marketplaceStatisticRepository,
  organizationStatisticRepository,
} = repositories;
