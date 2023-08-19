import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Offer, OfferStatus } from '../../models/Offer';

export interface OfferRepository {
  listByPost(tourPostId: string): Promise<Offer[]>,

  listSentOffersOfOrganization(
    organization: string,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listSentOffersOfOrganizationByOfferStatus(
    organization: string,
    offerStatus: OfferStatus,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listReceivedOffersOfOrganization(
    organization: string,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listByAuthor(
    authorId: string,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listReceivedOffersOfUser(
    userId: string,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  create(offer: Offer): Promise<Offer>,

  get(id: string): Promise<Offer | undefined>,

  update(
    id: string,
    offer: Partial<Offer>
  ): Promise<Offer>,

  generateCode(): Promise<string>,
}
