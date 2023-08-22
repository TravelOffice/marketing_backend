import {
  DeletingIndexes,
  TopCommissionTourPosts,
} from '../../models/statistic/TopCommissionTourPosts';
import { TourPostsStatistic } from '../../models/statistic/TourPostsStatistic';

export interface TourPostStatisticRepository {
  batchUpdateTourPostsStatistic(
    postsChangedStats: TourPostsStatistic,
  ): Promise<void>;

  batchUpdateTopCommissionTourPosts(
    topCommissionTourPosts: TopCommissionTourPosts,
  ): Promise<void>;

  batchDeleteTopCommissionTourPosts(deletingIndexes: DeletingIndexes): Promise<void>;
}
