import { SessionStatistic, SessionStatus } from '../../models/SessionStatistic';

export interface GetUserTotalSessionByStatusUseCase {
  invoke(
    tenant: string,
    username: string,
    status: SessionStatus,
  ): Promise<SessionStatistic>;
}
