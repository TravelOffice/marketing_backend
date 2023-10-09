import { FilteringDuration } from '../../models/FilteringDuration';
import { ProficiencyTourResponse } from '../../models/DepartureTourStatistic';

export interface GetTopProficiencyTourUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringDuration,
    topCount?: number,
  ): Promise<ProficiencyTourResponse[]>;
}
