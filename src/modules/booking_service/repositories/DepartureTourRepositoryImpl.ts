import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';
import { DepartureTour } from '../models/tour/DepartureTour';

export default class DepartureTourRepositoryImpl implements DepartureTourRepository {
  /**
   * Retrieves a departure tour by its ID and tenant from the DynamoDB table.
   *
   * @param tenant - The ID of the tenant.
   * @param id - The ID of the departure tour to retrieve.
   * @returns A Promise that resolves to the retrieved departure tour.
   */
  getDepartureTour = async (
    tenant: string,
    id: string,
  ) => dynamoProvider.getItem<DepartureTour>(
    await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
    `TENANT#${tenant}#DEPARTURE_TOUR`,
    id,
  );
}
