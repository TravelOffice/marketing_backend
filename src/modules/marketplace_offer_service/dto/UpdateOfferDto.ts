import { Offer } from '../models/Offer';

export type UpdateOfferDto = Pick<Offer,
    'code' |
    'tourPostId' |
    'organizationId' |
    'description' |
    'totalPax' |
    'pricePerPax' |
    'commissionRate'
>;
