import { OrganizationStatistic } from '../../models/OrganizationStatistic';

export interface GetOrganizationStatisticUseCase {
  invoke(
    orgId: string,
    currentUser: {
      tenant: string;
      username: string;
      name: string;
    }
  ): Promise<OrganizationStatistic | undefined>;
}
