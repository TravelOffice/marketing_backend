import { CognitoUser } from '../models/CognitoUser';
import { MarketplaceTermsAcceptedEvidence } from '../models/MarketplaceTermsAcceptedEvidence';
import { marketplaceTermsEvidenceRepository } from '../repositories';
import { MARKETPLACE_TERMS_ACCEPTED_INDEX } from '../utils/constants';
import { CreateMarketplaceTermsEvidenceUseCase } from './interfaces/CreateMarketplaceTermsEvidenceUseCase';

export default class CreateMarketplaceTermsEvidenceUseCaseImpl
implements CreateMarketplaceTermsEvidenceUseCase {
  invoke = async (currentUser: CognitoUser, termsVersion: string) => {
    const { tenant, username } = currentUser;
    const now = Date.now();
    const evidence: MarketplaceTermsAcceptedEvidence = {
      pk: MARKETPLACE_TERMS_ACCEPTED_INDEX,
      sk: tenant,
      organization: tenant,
      acceptedBy: username,
      isAccepted: true,
      createdAt: now,
      updatedAt: now,
      termsVersion,
    };
    return marketplaceTermsEvidenceRepository.create(tenant, evidence);
  };
}
