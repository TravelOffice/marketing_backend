import { FilteringTimeRange } from '../models/FilteringDuration';
import { tenantStatisticRepository } from '../repositories';
import { GetTopFavouriteTourUseCase } from './interfaces/GetTopFavouriteTourUseCase';
import { BookingStatistic, FavouriteTour } from '../models/BookingStatistic';
import { DEFAULT_TOP_COUNT } from '../utils/constants';

export default class GetTopFavouriteTourUseCaseImpl implements GetTopFavouriteTourUseCase {
  invoke = async (
    tenant: string,
    filteringDuration?: FilteringTimeRange,
    topCount?: number,
  ): Promise<FavouriteTour[]> => {
    const records = await tenantStatisticRepository.getBookingStatistic(
      tenant,
      filteringDuration,
    );

    // Group records by tour template id
    const groupByTourTemplate = records.reduce((
      group: { [key: string]: BookingStatistic[] },
      bookingStatistic,
    ) => {
      const { ttId: tourTemplateId } = bookingStatistic;
      if (group[tourTemplateId]) {
        group[tourTemplateId].push(bookingStatistic);
        return group;
      }
      return {
        ...group,
        [tourTemplateId]: [bookingStatistic],
      };
    }, {});

    // Sort tour template name by number of booking
    const sortedTourTemplateIds = Object.keys(groupByTourTemplate).sort(
      (a, b) => groupByTourTemplate[b].length - groupByTourTemplate[a].length,
    ).splice(0, topCount || DEFAULT_TOP_COUNT);
    return sortedTourTemplateIds.map((id) => {
      const items = groupByTourTemplate[id];
      return {
        tourTemplateId: id,
        tourTemplateName: items[0].ttN,
        numberOfBooking: items.length,
      };
    });
  };
}
