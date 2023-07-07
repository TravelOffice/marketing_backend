import { helper } from 'core';
import { TourLocation } from '../models/TourLocation';
import { tourLocationRepository } from '../repositories';
import {
  CREATED_AT_INDEX, STATUS_INDEX, UPDATED_AT_INDEX,
} from '../utils/constants';
import { CreateTourLocationUseCase } from './interfaces/CreateTourLocationUseCase';

export default class CreateTourLocationUseCaseImpl implements CreateTourLocationUseCase {
  private allowedCreatingKeys: (keyof TourLocation)[] = [
    'name',
    'status',
    'creator',
  ];

  invoke = async (
    tenantId: string,
    tourLocation: TourLocation,
  ) => {
    const now = Date.now();
    const code = await tourLocationRepository.generateTourLocationCode(tenantId);
    const tourLocationToAdd: TourLocation = {
      ...(helper.extractDataFromObject(tourLocation, this.allowedCreatingKeys) as TourLocation),
      code,
      createdAt: now,
      updatedAt: now,
      lsi1: `${CREATED_AT_INDEX}#${now}`,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${tourLocation.status}`,
    };
    await tourLocationRepository.create(tenantId, tourLocationToAdd);
    return helper.excludeDataFromObject(tourLocationToAdd) as TourLocation;
  };
}
