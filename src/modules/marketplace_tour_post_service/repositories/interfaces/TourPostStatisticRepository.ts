import { TopCommissionTourPosts } from '../../models/statistic/TopCommissionTourPosts';
import { TourPostStatistic } from '../../models/statistic/TourPostStatistic';

export interface TourPostStatisticRepository {
  listTopCommissionTourPosts(limit?: number): Promise<TopCommissionTourPosts>;
  getByLeadOrTourTemplateId(id: string): Promise<TourPostStatistic | undefined>;
}
