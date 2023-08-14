// TODO: Declare repository objects which can be used in this service here

import OrgFeedbackRepositoryImpl from './OrgFeedbackRepositoryImpl';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import { OrgFeedbackRepository } from './interfaces/OrgFeedbackRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';

interface Repositories {
  orgFeedbackRepository: OrgFeedbackRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
}

const repositories: Repositories = {
  orgFeedbackRepository: new OrgFeedbackRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
};

export const {
  orgFeedbackRepository,
  marketplaceUserRepository,
} = repositories;
