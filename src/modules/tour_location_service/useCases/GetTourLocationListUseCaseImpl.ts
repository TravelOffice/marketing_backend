import { helper } from 'core';
import { TourLocation } from '../models/TourLocation';
import { tourLocationRepository } from '../repositories';
import { GetTourLocationListUseCase } from './interfaces/GetTourLocationListUseCase';

export default class GetTourLocationListUseCaseImpl implements GetTourLocationListUseCase {
  invoke = async (tenantId: string) => {
    const items = await tourLocationRepository.list(tenantId);
    // Formatting the items and excluse the key property
    const tourLocation = items.map(
      (item) => helper.excludeDataFromObject(item) as TourLocation,
    );
    return tourLocation;
  };
}
