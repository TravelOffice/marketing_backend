import { Condition, ResponseTimeFilterParams } from '../models/ChatSessionStatistic';
import { tenantStatisticRepository } from '../repositories';
import { GetUserResponseByConditionTimeUseCase } from './interfaces/GetUserResponseByConditionTimeUseCase';

export default class GetUserResponseByConditionTimeUseCaseImpl
implements GetUserResponseByConditionTimeUseCase {
  invoke = async (
    tenant: string,
    username: string,
    filterParam: ResponseTimeFilterParams,
    startTime?: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { username, startTime },
    );
    let total = records.length;
    if (filterParam.condition === Condition.GREATER_THAN_OR_EQUAL) {
      total = records.filter((
        session,
      ) => Number(session.lsi4) >= filterParam.comparasionTime).length;
    } else if (filterParam.condition === Condition.LESS_THAN_OR_EQUAL) {
      total = records.filter((
        session,
      ) => Number(session.lsi4) <= filterParam.comparasionTime).length;
    }
    return {
      total,
    };
  };
}
