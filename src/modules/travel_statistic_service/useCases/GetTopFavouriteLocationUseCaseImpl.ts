import { FilteringDuration } from '../models/FilteringDuration';
import { tenantStatisticRepository } from '../repositories';
import { GetTopFavouriteLocationUseCase } from './interfaces/GetTopFavouriteLocationUseCase';
import { FavouriteLocation, LeadStatistic } from '../models/LeadStatistic';

export default class GetTopFavouriteLocationUseCaseImpl implements GetTopFavouriteLocationUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringDuration,
    topCount?: number,
  ): Promise<FavouriteLocation[]> => {
    const records = await tenantStatisticRepository.getLeadStatistic(
      tenant,
      filteringDuration,
    );
    const groupByLocation = records.reduce((
      group: { [key: string]: LeadStatistic[] },
      leadStatistic,
    ) => {
      const { lcId: locationId } = leadStatistic;
      if (group[locationId]) {
        group[locationId].push(leadStatistic);
        return group;
      }
      return {
        ...group,
        [locationId]: [],
      };
    }, {});

    // Sort tour template name by number of booking
    const sortedLocationIds = Object.keys(groupByLocation).sort(
      (a, b) => groupByLocation[b].length - groupByLocation[a].length,
    ).splice(0, topCount);
    return sortedLocationIds.map((id) => {
      const items = groupByLocation[id];
      return {
        locationId: id,
        locationName: items[0].lcN,
        numberOfLead: items.length,
      };
    });
  };
}
