import { Offer } from '../models/Offer';

export type CreateOfferDto = Pick<Offer, 'description' | 'totalPax' | 'pricePerPax' | 'commission'>;
