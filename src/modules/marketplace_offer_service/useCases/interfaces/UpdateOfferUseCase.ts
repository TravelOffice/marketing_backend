import { UpdateOfferDto } from '../../dto/UpdateOfferDto';
import { CognitoUser } from '../../models/CognitoUser';
import { Offer } from '../../models/Offer';

export interface UpdateOfferUseCase {
  invoke(
    currentUser: CognitoUser,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer>,
}
