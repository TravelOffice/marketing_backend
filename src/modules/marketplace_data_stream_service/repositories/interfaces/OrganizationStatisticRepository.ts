import { OrganizationsStatistic } from '../../models/statistic/OrganizationsStatistic';

export interface OrganizationStatisticRepository {
  batchUpdateOrganizationsStatistic(
    orgStatisticsChangeCount: OrganizationsStatistic,
  ): Promise<void>;
}
