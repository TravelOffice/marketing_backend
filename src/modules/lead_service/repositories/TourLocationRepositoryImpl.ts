import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { TourLocationRepository } from './interfaces/TourLocationRepository';
import { TENANT_INDEX, TOUR_LOCATION_INDEX } from '../utils/constants';

export default class TourLocationRepositoryImpl implements TourLocationRepository {
  async get(tenantId: string, locationId: string) {
    return dynamoProvider.getItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${TOUR_LOCATION_INDEX}`,
      locationId,
    );
  }
}
