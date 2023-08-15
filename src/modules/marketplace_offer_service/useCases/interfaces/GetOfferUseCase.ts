import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetOfferUseCase {
  invoke(
    currentUser: CognitoUser,
    organizationId: string,
    tourPostId: string,
    offerId: string,
  ): Promise<Offer | undefined>,
}
