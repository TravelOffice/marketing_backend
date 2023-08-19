import { marketplaceStatisticRepository } from '../repositories';
import { OrganizationStatistic } from '../models/OrganizationStatistic';
import { GetOrganizationStatisticUseCase } from './interfaces/GetOrganizationStatisticUseCase';

export default class GetOrganizationStatisticUseCaseImpl
implements GetOrganizationStatisticUseCase {
  invoke(orgId: string): Promise<OrganizationStatistic | undefined> {
    return marketplaceStatisticRepository.getOrganizationStatistic(orgId);
  }
}
