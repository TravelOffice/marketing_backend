import { FilteringTimeRange } from '../../models/FilteringDuration';
import { ProficiencyTourResponse } from '../../models/DepartureTourStatistic';

export interface GetTopProficiencyTourUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
    topCount?: number,
  ): Promise<ProficiencyTourResponse[]>;
}
