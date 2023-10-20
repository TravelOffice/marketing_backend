import { SessionStatistic } from '../../models/SessionStatistic';

export interface GetOrgTotalSessionByDurationUseCase {
  invoke(
    tenant: string,
    duration: string,
  ): Promise<SessionStatistic>;
}
