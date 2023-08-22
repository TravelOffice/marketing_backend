import MarketplaceStatisticRepositoryImpl from './MarketplaceStatisticRepositoryImpl';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import OrganizationStatisticRepositoryImpl from './OrganizationStatisticRepositoryImpl';
import TourPostStatisticRepositoryImpl from './TourPostStatisticRepositoryImpl';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { OrganizationStatisticRepository } from './interfaces/OrganizationStatisticRepository';
import { TourPostStatisticRepository } from './interfaces/TourPostStatisticRepository';

interface Repositories {
  marketplaceUserRepository: MarketplaceUserRepository,
  marketplaceStatisticRepository: MarketplaceStatisticRepository,
  organizationStatisticRepository: OrganizationStatisticRepository,
  tourPostStatisticRepository: TourPostStatisticRepository,
}

const repositories: Repositories = {
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  marketplaceStatisticRepository: new MarketplaceStatisticRepositoryImpl(),
  organizationStatisticRepository: new OrganizationStatisticRepositoryImpl(),
  tourPostStatisticRepository: new TourPostStatisticRepositoryImpl(),
};

export const {
  marketplaceUserRepository,
  marketplaceStatisticRepository,
  organizationStatisticRepository,
  tourPostStatisticRepository,
} = repositories;
