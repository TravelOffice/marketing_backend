import { Offer } from '../../models/Offer';

export interface OfferRepository {
  listSuccessOfferByOrgAndAuthor(organization: string, author: string): Promise<Offer[]>;
}
