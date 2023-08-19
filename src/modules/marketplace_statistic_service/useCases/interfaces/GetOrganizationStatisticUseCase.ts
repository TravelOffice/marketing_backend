import { OrganizationStatistic } from '../../models/OrganizationStatistic';

export interface GetOrganizationStatisticUseCase {
  invoke(orgId: string): Promise<OrganizationStatistic | undefined>,
}
