import { Offer } from '../../models/Offer';

export interface OfferRepository {
  listSuccessOfferByPostAndAuthor(tourPostId: string, author: string): Promise<Offer[]>;
}
