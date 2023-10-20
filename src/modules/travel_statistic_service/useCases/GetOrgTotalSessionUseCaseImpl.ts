import { tenantStatisticRepository } from '../repositories';
import { GetOrgTotalSessionUseCase } from './interfaces/GetOrgTotalSessionUseCase';

export default class GetOrgTotalSessionUseCaseImpl
implements GetOrgTotalSessionUseCase {
  invoke = async (
    tenant: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
    );
    return {
      total: records.length,
    };
  };
}
