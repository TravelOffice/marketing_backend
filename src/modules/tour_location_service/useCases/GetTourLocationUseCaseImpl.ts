import { helper } from 'core';
import { TourLocation } from '../models/TourLocation';
import { tourLocationRepository } from '../repositories';
import { GetTourLocationUseCase } from './interfaces/GetTourLocationUseCase';
import logger from '../utils/logger';

export default class GetTourLocationUseCaseImpl implements GetTourLocationUseCase {
  invoke = async (tenantId: string, id: string) => {
    const tourLocation = await tourLocationRepository.get(tenantId, id);
    if (!tourLocation) {
      logger.log(`Could not found Tour Location ${id} of tenant ${tenantId}`);
      throw new Error(`Could not found Tour Location ${id}`);
    }
    return helper.excludeDataFromObject(tourLocation) as TourLocation;
  };
}
