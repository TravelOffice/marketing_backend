import { Offer } from '../models/Offer';

export type UpdateOfferDto = Pick<Offer,
  'code' |
  'tourPostId' |
  'sentOrg' |
  'description' |
  'totalPax' |
  'pricePerPax' |
  'commission'
>;
