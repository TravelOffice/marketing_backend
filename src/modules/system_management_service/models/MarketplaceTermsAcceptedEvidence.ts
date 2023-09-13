import { BaseDdbModel } from 'common-models';

export interface MarketplaceTermsAcceptedEvidence extends BaseDdbModel {
    organization: string,
    acceptedBy: string,
    termsVersion: string,
    isAccepted: boolean,
}
