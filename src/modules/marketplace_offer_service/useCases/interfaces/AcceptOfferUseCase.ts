import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface AcceptOfferUseCase {
  invoke(
    currentUser: CognitoUser,
    offerId: string,
  ): Promise<Offer>,
}
