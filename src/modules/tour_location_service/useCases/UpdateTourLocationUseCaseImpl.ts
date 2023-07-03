import { helper } from 'core';
import { TourLocation } from '../models/TourLocation';
import { tourLocationRepository } from '../repositories';
import { UpdateTourLocationUseCase } from './interfaces/UpdateTourLocationUseCase';
import { STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';

export default class UpdateTourLocationUseCaseImpl implements UpdateTourLocationUseCase {
  private allowedUpdatingKeys: (keyof TourLocation)[] = [
    'name',
    'status',
  ];

  invoke = async (
    tenantId: string,
    id: string,
    tourLocation: TourLocation,
  ) => {
    const now = Date.now();
    const existingTourLocation = await tourLocationRepository.get(tenantId, id);
    if (!existingTourLocation) {
      throw new Error(`Tour Location [${id}] not found for tenant ${tenantId}`);
    }

    const tourLocationToUpdate: TourLocation = {
      ...existingTourLocation,
      ...helper.extractDataFromObject(tourLocation, this.allowedUpdatingKeys),
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${tourLocation.status}`,
    };

    await tourLocationRepository.update(
      tenantId,
      id,
      tourLocationToUpdate,
    );

    return helper.excludeDataFromObject(tourLocationToUpdate) as TourLocation;
  };
}
