import { GetTopProficiencyTourUseCase } from './interfaces/GetTopProficiencyTourUseCase';
import { FilteringDuration } from '../models/FilteringDuration';
import { ProficiencyTourResponse } from '../models/DepartureTourStatistic';
import { tenantStatisticRepository } from '../repositories';
import { DEFAULT_TOP_COUNT } from '../utils/constants';

export default class GetTopProficiencyTourUseCaseImpl implements GetTopProficiencyTourUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringDuration,
    topCount?: number,
  ): Promise<ProficiencyTourResponse[]> => {
    const records = await tenantStatisticRepository.getDepartureTourStatistic(
      tenant,
      filteringDuration,
    );
    // Sort DESC top proficiency tour
    const topProficiencyTour = records.sort(
      (a, b) => b.rv / b.c - a.rv / a.c,
    ).splice(0, topCount || DEFAULT_TOP_COUNT);
    return topProficiencyTour.map((tour) => ({
      departureTourId: tour.sk,
      departureTourName: tour.dtN,
      proficiency: Math.round(tour.rv / tour.c),
      revenue: tour.rv,
      cost: tour.c,
    }));
  };
}
