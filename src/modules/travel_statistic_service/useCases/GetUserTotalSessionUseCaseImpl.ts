import { tenantStatisticRepository } from '../repositories';
import { GetUserTotalSessionUseCase } from './interfaces/GetUserTotalSessionUseCase';

export default class GetUserTotalSessionUseCaseImpl
implements GetUserTotalSessionUseCase {
  invoke = async (
    tenant: string,
    username: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { username },
    );
    return {
      total: records.length,
    };
  };
}
