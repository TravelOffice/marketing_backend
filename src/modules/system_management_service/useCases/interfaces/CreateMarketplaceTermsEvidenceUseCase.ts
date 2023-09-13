import { CognitoUser } from '../../models/CognitoUser';
import {
  MarketplaceTermsAcceptedEvidence,
} from '../../models/MarketplaceTermsAcceptedEvidence';

export interface CreateMarketplaceTermsEvidenceUseCase {
  invoke(
    currentUser: CognitoUser,
    termsVersion: string,
  ): Promise<MarketplaceTermsAcceptedEvidence | undefined>
}
