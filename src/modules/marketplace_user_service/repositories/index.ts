import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import TravelUserRepositoryImpl from './TravelUserRepositoryImpl';
import { TravelUserRepository } from './interfaces/TravelUserRepository';

interface Repositories {
  travelUserRepository: TravelUserRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
}

const repositories: Repositories = {
  travelUserRepository: new TravelUserRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
};

export const {
  travelUserRepository,
  marketplaceUserRepository,
} = repositories;
