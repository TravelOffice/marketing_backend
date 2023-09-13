import { CognitoUser } from '../../models/CognitoUser';
import {
  MarketplaceTermsAcceptedEvidence,
} from '../../models/MarketplaceTermsAcceptedEvidence';

export interface GetMarketplaceTermsEvidenceUseCase {
  invoke(currentUser: CognitoUser): Promise<MarketplaceTermsAcceptedEvidence | undefined>
}
