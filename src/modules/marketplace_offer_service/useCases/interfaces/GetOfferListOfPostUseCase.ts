import { Offer } from '../../models/Offer';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetOfferListOfPostUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
  ): Promise<Offer[]>,
}
