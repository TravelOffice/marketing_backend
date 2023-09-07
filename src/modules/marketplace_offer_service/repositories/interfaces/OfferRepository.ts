import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Offer, OfferStatus } from '../../models/Offer';

export interface OfferRepository {
  listByPost(tourPostId: string): Promise<Offer[]>,

  listSentOffersOfOrganization(
    organization: string,
    paginationParams?: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listReceivedOffersOfOrganization(
    organization: string,
    paginationParams?: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listSentOffersOfUser(
    senderId: string,
    paginationParams?: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listReceivedOffersOfUser(
    receiverId: string,
    paginationParams?: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  create(offer: Offer): Promise<Offer>,

  get(id: string): Promise<Offer | undefined>,

  update(
    id: string,
    offer: Partial<Offer>,
    status?: OfferStatus
  ): Promise<Offer>,

  generateCode(): Promise<string>,
}
