import { SessionStatistic } from '../../models/SessionStatistic';

export interface GetUserTotalSessionByDurationUseCase {
  invoke(
    tenant: string,
    username: string,
    duration: string,
  ): Promise<SessionStatistic>;
}
