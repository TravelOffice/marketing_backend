import { CognitoUser } from '../models/CognitoUser';
import { tourPostStatisticRepository } from '../repositories';
import { KEY_DELIMITER, TENANT_INDEX } from '../utils/constants';
import { GetLinkedLeadOrTourInfoOnMarketplaceUseCase } from './interfaces/GetLinkedLeadOrTourInfoOnMarketplace';

export default class GetLinkedLeadOrTourInfoOnMarketplaceUseCaseImpl
implements GetLinkedLeadOrTourInfoOnMarketplaceUseCase {
  invoke = async (currentUser: CognitoUser, targetId: string) => {
    const { tenant } = currentUser;
    // Id format LEAD#id or TOUR_TEMPLATE#id
    // Need to add tenant prefix in order to query
    const key = `${TENANT_INDEX}#${tenant}#${targetId}`;
    const tourPostStatistics = await tourPostStatisticRepository.getByLeadOrTourTemplateId(key);

    // If the tour post is not found,
    // mark tour post as unavailable with linked lead or tour template info
    if (!tourPostStatistics || tourPostStatistics.length === 0) {
      return { isAvailable: false };
    }

    const { organization } = tourPostStatistics[0]!;
    if (organization !== tenant) {
      throw new Error('Organization of the tour post is not the same as the current user');
    }

    // Calculate total offers across all tour posts
    const allPostsOffers = tourPostStatistics.reduce((acc, cur) => acc + cur.totalOffers, 0);
    const posts = tourPostStatistics.map((tourPostStatistic) => {
      const { sk, totalOffers } = tourPostStatistic;
      const [, postId] = sk.split(KEY_DELIMITER);
      return {
        postId,
        totalOffers,
      };
    });

    return {
      isAvailable: true,
      totalOffers: allPostsOffers,
      posts,
    };
  };
}
