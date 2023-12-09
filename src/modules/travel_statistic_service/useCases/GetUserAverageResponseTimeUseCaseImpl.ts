import { tenantStatisticRepository } from '../repositories';
import { GetUserAverageResponseTimeUseCase } from './interfaces/GetUserAverageResponseTimeUseCase';

export default class GetUserAverageResponseTimeUseCaseImpl
implements GetUserAverageResponseTimeUseCase {
  invoke = async (
    tenant: string,
    username: string,
    startTime: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { startTime, username },
    );
    const totalSession = records.length;
    const totalDuration = records.reduce((acc, cur) => acc + Number(cur.lsi4), 0);

    return {
      total_session: totalSession,
      average_duration: Math.round(totalDuration / totalSession) || 0,
    };
  };
}
