import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Offer, OfferStatus } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetSentOffersOfCurrentUserUseCase {
  invoke(
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,
}
