import { SessionStatus } from '../models/SessionStatistic';
import { tenantStatisticRepository } from '../repositories';
import { GetOrgTotalSessionByStatusUseCase } from './interfaces/GetOrgTotalSessionByStatusUseCase';

export default class GetOrgTotalSessionByStatusUseCaseImpl
implements GetOrgTotalSessionByStatusUseCase {
  invoke = async (
    tenant: string,
    status: SessionStatus,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { status },
    );
    return {
      total: records.length,
    };
  };
}
