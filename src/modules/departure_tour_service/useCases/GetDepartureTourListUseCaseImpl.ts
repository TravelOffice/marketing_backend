import { helper } from 'core';
import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { GetDepartureTourListUseCase } from './interfaces/GetDepartureTourListUseCase';

export default class GetDepartureTourListUseCaseImpl implements GetDepartureTourListUseCase {
  invoke = async (tenantId: string) => {
    const items = await departureTourRepository.list(tenantId);
    // Formatting the items and excluse the key property
    const departureTours = items.map(
      (item) => helper.excludeDataFromObject(item) as DepartureTour,
    );
    return departureTours;
  };
}
