import { TourPostsStatistic } from '../../models/statistic/TourPostsStatistic';

export interface TourPostStatisticRepository {
  batchUpdateTourPostsStatistic(
    postsChangedStats: TourPostsStatistic,
  ): Promise<void>;
}
