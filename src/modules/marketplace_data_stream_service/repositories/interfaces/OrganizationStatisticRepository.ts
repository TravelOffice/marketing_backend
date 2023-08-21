import { OrganizationsStatistic } from '../../models/statistic/OrganizationsStatistic';

export interface OrganizationStatisticRepository {
  batchUpdateOrganizationsStatistic(
    orgsChangedStats: OrganizationsStatistic,
  ): Promise<void>;
}
