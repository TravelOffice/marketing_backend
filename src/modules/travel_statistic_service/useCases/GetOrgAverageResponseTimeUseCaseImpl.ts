import { tenantStatisticRepository } from '../repositories';
import { GetOrgAverageResponseTimeUseCase } from './interfaces/GetOrgAverageResponseTimeUseCase';

export default class GetOrgAverageResponseTimeUseCaseImpl
implements GetOrgAverageResponseTimeUseCase {
  invoke = async (
    tenant: string,
    startTime: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { startTime },
    );
    const totalSession = records.length;
    const totalDuration = records.reduce((acc, cur) => acc + Number(cur.lsi4), 0);

    return {
      total_session: totalSession,
      average_duration: Math.round(totalDuration / totalSession) || 0,
    };
  };
}
