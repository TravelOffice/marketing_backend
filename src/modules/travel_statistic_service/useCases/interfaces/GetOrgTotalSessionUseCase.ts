import { SessionStatistic } from '../../models/SessionStatistic';

export interface GetOrgTotalSessionUseCase {
  invoke(
    tenant: string,
  ): Promise<SessionStatistic>;
}
