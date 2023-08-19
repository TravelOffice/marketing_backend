// TODO: Declare repository objects which can be used in this service here

import MarketplaceStatisticRepositoryImpl from './MarketplaceStatisticRepositoryImpl';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';

interface Repositories {
  marketplaceStatisticRepository: MarketplaceStatisticRepository,
}

const repositories : Repositories = {
  marketplaceStatisticRepository: new MarketplaceStatisticRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  marketplaceStatisticRepository,
} = repositories;
