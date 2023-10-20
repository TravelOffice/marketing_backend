import { tenantStatisticRepository } from '../repositories';
import { GetOrgTotalSessionByDurationUseCase } from './interfaces/GetOrgTotalSessionByDurationUseCase';

export default class GetOrgTotalSessionByDurationUseCaseImpl
implements GetOrgTotalSessionByDurationUseCase {
  invoke = async (
    tenant: string,
    duration: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { duration },
    );
    return {
      total: records.length,
    };
  };
}
