import { CognitoUser } from '../../models/CognitoUser';
import { CreateOfferDto } from '../../dto/CreateOfferDto';
import { Offer } from '../../models/Offer';

export interface CreateOfferUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer>,
}
