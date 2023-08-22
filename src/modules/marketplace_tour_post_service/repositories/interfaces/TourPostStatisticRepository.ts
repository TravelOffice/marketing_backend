import { TopCommissionTourPosts } from '../../models/statistic/TopCommissionTourPosts';

export interface TourPostStatisticRepository {
  listTopCommissionTourPosts(limit?: number): Promise<TopCommissionTourPosts>;
}
