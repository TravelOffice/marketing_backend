import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface CancelOfferUseCase {
  invoke(
    currentUser: CognitoUser,
    offerId: string,
    cancelReason: string,
  ): Promise<Offer>,
}
