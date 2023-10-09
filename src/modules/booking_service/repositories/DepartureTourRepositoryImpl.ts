import { dynamoProvider, logger } from 'core';
import { getAwsSecretValue } from 'get-env';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';
import { DepartureTour } from '../models/tour/DepartureTour';
import { DEPARTURE_TOUR_INDEX, TENANT_INDEX } from '../utils/constants';

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

  /**
   * Updates a DepartureTour for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param departureTourId The ID of the departure tour.
   * @param departureTour The updated DepartureTour object.
   * @returns The updated DepartureTour.
   */
  update = async (
    tenantId: string,
    departureTourId: string,
    departureTour: Partial<DepartureTour>,
  ) => {
    const pk = `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`;
    const sk = `${departureTourId}`;

    logger.log(`Updating DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - DepartureTour:`, departureTour);

    const result = await dynamoProvider.updateItemWithSetExpression(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      pk,
      sk,
      departureTour,
    );

    logger.log(`DepartureTour updated successfully for tenant ${tenantId}`);

    return result.Attributes as DepartureTour;
  };
}
