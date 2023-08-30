import { tourPostRepository, tourPostStatisticRepository } from '../repositories';
import { GetTopCommissionPostsUseCase } from './interfaces/GetTopCommissionPostsUseCase';

export default class GetTopCommissionPostsUseCaseImpl implements GetTopCommissionPostsUseCase {
  invoke = async (topCount?: number) => {
    const topComissionPostItems = await tourPostStatisticRepository
      .listTopCommissionTourPosts(topCount);
    if (!topComissionPostItems.length) { return []; }
    const topComissionPostIds = topComissionPostItems.map((item) => item.keys.sk);
    return tourPostRepository.listByIds(topComissionPostIds);
  };
}
