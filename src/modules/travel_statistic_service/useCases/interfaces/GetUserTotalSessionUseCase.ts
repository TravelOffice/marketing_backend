import { SessionStatistic } from '../../models/SessionStatistic';

export interface GetUserTotalSessionUseCase {
  invoke(
    tenant: string,
    username: string,
  ): Promise<SessionStatistic>;
}
