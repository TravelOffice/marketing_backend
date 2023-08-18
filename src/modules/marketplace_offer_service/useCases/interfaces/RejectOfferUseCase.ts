import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface RejectOfferUseCase {
  invoke(
    currentUser: CognitoUser,
    offerId: string,
    rejectReason: string,
  ): Promise<Offer>,
}
