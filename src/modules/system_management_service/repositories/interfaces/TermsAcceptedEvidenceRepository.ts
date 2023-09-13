import { MarketplaceTermsAcceptedEvidence } from '../../models/MarketplaceTermsAcceptedEvidence';

export interface TermsAcceptedEvidenceRepository {
  create(
    tenant: string,
    acceptedEvidence: MarketplaceTermsAcceptedEvidence,
  ): Promise<MarketplaceTermsAcceptedEvidence | undefined>,

  update(
    tenant: string,
    acceptedEvidence: Partial<MarketplaceTermsAcceptedEvidence>,
  ): Promise<MarketplaceTermsAcceptedEvidence | undefined>,

  get(tenant: string): Promise<MarketplaceTermsAcceptedEvidence | undefined>,
}
