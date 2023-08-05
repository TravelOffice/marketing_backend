import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, logger } from 'core';
import { DepartureTour } from '../models/DepartureTour';
import {
  DEPARTURE_TOUR_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';

export default class DepartureTourRepositoryImpl implements DepartureTourRepository {
  /**
   * Retrieves a departure tour for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param departureTourId The ID of the departure tour.
   * @returns The retrieved departure tour.
   */
  get = async (tenantId: string, departureTourId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    logger.log(`Retrieving DepartureTour for tenant ${tenantId} with [${departureTourId}]`);

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`,
      `${departureTourId}`,
    );
    if (!item) throw new Error(`Departure tour [${departureTourId}] not found`);

    logger.log('DepartureTour retrieved:', item);

    return item as DepartureTour;
  };
}
