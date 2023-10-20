import { SessionStatistic, SessionStatus } from '../../models/SessionStatistic';

export interface GetOrgTotalSessionByStatusUseCase {
  invoke(
    tenant: string,
    status: SessionStatus,
  ): Promise<SessionStatistic>;
}
