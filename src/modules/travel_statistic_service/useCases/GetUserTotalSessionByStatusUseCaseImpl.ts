import { SessionStatus } from '../models/ChatSessionStatistic';
import { tenantStatisticRepository } from '../repositories';
import { GetUserTotalSessionByStatusUseCase } from './interfaces/GetUserTotalSessionByStatusUseCase';

export default class GetUserTotalSessionByStatusUseCaseImpl
implements GetUserTotalSessionByStatusUseCase {
  invoke = async (
    tenant: string,
    username: string,
    status: SessionStatus,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { username, status },
    );
    return {
      total: records.length,
    };
  };
}
