import { BaseDdbModel } from 'common-models';

// eslint-disable-next-line no-shadow
export enum OfferStatus {
    IN_PROCESS = 'IN_PROCESS',
    CANCELLED = 'CANCELLED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export const OfferStatusTypes = Object.keys(OfferStatus);

export interface Offer extends BaseDdbModel {
    code: string, // Auto-generated code from DynamoDB
    description?: string, // Description of the offer
    totalPax: string, // Total pax of the offer
    pricePerPax: number, // Price per pax of the offer
    commissionRate: number, // Commission rate per pax of the offer
    authorId: string, // Alias id of marketplace user that is auto-generated or set by user
    organizationId: string, // The ID of the organization
    tourPostId: string, // The ID of the tour post
    offerStatus: OfferStatus, // The status of the offer,
    cancelReason?: string, // The reason for canceling the offer
    rejectReason?: string, // The reason for rejecting the offer
    summitedAt?: number, // The time the offer was submitted
    canceledAt?: number, // The time the offer was cancelled
    acceptedAt?: number, // The time the offer was accepted
    rejectedAt?: number, // The time the offer was rejected
}
