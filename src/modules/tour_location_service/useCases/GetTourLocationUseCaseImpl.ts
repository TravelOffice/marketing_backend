import { helper } from 'core';
import logger from 'core/utils/logger';
import { TourLocation } from '../models/TourLocation';
import { tourLocationRepository } from '../repositories';
import { GetTourLocationUseCase } from './interfaces/GetTourLocationUseCase';

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
