// TODO: Declare repository objects which can be used in this service here

import OrgFeedbackRepositoryImpl from './OrgFeedbackRepositoryImpl';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';
import { OrgFeedbackRepository } from './interfaces/OrgFeedbackRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { OfferRepository } from './interfaces/OfferRepository';
import OfferRepositoryImpl from './OfferRepositoryImpl';

interface Repositories {
  orgFeedbackRepository: OrgFeedbackRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
  offerRepository: OfferRepository,
}

const repositories: Repositories = {
  orgFeedbackRepository: new OrgFeedbackRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
  offerRepository: new OfferRepositoryImpl(),
};

export const {
  orgFeedbackRepository,
  marketplaceUserRepository,
  offerRepository,
} = repositories;
