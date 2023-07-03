import { helper } from 'core';
import logger from 'core/utils/logger';
import { departureTourRepository } from '../repositories';
import { GetDepartureTourUseCase } from './interfaces/GetDepartureTourUseCase';
import { DepartureTour } from '../models/DepartureTour';

export default class GetDepartureTourUseCaseImpl implements GetDepartureTourUseCase {
  invoke = async (
    tenantId: string,
    departureTourId: string,
  ) => {
    const departureTour = await departureTourRepository.get(tenantId, departureTourId);
    if (!departureTour) {
      logger.log(`Could not found Departure Tour ${departureTourId} of tenant ${tenantId}`);
      throw new Error(`Could not found Departure Tour ${departureTourId}`);
    }
    return helper.excludeDataFromObject(departureTour) as DepartureTour;
  };
}
