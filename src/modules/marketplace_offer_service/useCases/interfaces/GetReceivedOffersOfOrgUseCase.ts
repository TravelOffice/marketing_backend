import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetReceivedOffersOfOrgUseCase {
  invoke(
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined>,
}
