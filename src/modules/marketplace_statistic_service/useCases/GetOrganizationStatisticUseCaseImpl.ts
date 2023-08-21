import { marketplaceStatisticRepository } from '../repositories';
import { OrganizationStatistic } from '../models/OrganizationStatistic';
import { GetOrganizationStatisticUseCase } from './interfaces/GetOrganizationStatisticUseCase';

export default class GetOrganizationStatisticUseCaseImpl
implements GetOrganizationStatisticUseCase {
  invoke(
    orgId: string,
    currentUser: {
      tenant: string;
      username: string;
      name: string;
    },
  ): Promise<OrganizationStatistic | undefined> {
    const { tenant } = currentUser;
    if (tenant !== orgId) throw new Error('The user does not belong to the organization');
    return marketplaceStatisticRepository.getOrganizationStatistic(orgId);
  }
}
