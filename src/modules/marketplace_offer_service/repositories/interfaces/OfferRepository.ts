import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Offer, OfferStatus } from '../../models/Offer';

export interface OfferRepository {
  listByPost(organizationId: string, tourPostId: string): Promise<Offer[]>,

  listOffersSendFromOrganization(
    organizationId: string,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listOffersSendFromOrganizationByOfferStatus(
      organizationId: string,
      offerStatus: OfferStatus,
      paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  listByAuthor(
    organizationId: string,
    authorId: string,
    paginationParams?: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,

  create(offer: Offer): Promise<Offer>,

  get(organizationId: string, tourPostId: string, id: string): Promise<Offer | undefined>,

  update(
    organizationId: string,
    tourPostId: string,
    id: string,
    offer: Partial<Offer>
  ): Promise<Offer>,

  generateCode(): Promise<string>,
}
