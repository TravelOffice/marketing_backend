import { CognitoUser } from '../models/CognitoUser';
import { tourPostStatisticRepository } from '../repositories';
import { KEY_DELIMITER } from '../utils/constants';
import { GetLinkedLeadOrTourInfoOnMarketplaceUseCase } from './interfaces/GetLinkedLeadOrTourInfoOnMarketplace';

export default class GetLinkedLeadOrTourInfoOnMarketplaceUseCaseImpl
implements GetLinkedLeadOrTourInfoOnMarketplaceUseCase {
  invoke = async (currentUser: CognitoUser, targetId: string) => {
    const { tenant } = currentUser;
    const tourPostStatistic = await tourPostStatisticRepository.getByLeadOrTourTemplateId(targetId);

    // If the tour post is not found,
    // mark tour post as unavailable with linked lead or tour template info
    if (!tourPostStatistic) {
      return { isAvailable: false };
    }

    const { totalOffers, organization, sk } = tourPostStatistic;
    if (organization !== tenant) {
      throw new Error('Organization of the tour post is not the same as the current user');
    }

    const [, postId] = sk.split(KEY_DELIMITER);

    return {
      isAvailable: true,
      totalOffers,
      postId,
    };
  };
}
