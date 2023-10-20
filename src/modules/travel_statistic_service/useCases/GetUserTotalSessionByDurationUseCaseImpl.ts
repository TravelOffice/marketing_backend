import { tenantStatisticRepository } from '../repositories';
import { GetUserTotalSessionByDurationUseCase } from './interfaces/GetUserTotalSessionByDurationUseCase';

export default class GetUserTotalSessionByDurationUseCaseImpl
implements GetUserTotalSessionByDurationUseCase {
  invoke = async (
    tenant: string,
    username: string,
    duration: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { username, duration },
    );
    return {
      total: records.length,
    };
  };
}
