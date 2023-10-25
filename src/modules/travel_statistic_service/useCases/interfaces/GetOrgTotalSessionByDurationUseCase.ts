import { TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetOrgTotalSessionByDurationUseCase {
  invoke(
    tenant: string,
    duration: number,
  ): Promise<TotalChatSessionStatisticResponse>;
}
