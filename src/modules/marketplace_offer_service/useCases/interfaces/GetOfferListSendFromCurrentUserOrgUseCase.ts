import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetOfferListSendFromCurrentUserOrgUseCase {
  invoke(
    currentUser: CognitoUser,
    offerStatus: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,
}
