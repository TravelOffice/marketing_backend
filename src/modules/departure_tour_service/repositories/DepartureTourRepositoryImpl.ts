import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { DepartureTour } from '../models/DepartureTour';
import {
  CREATED_AT_INDEX, DEPARTURE_TOUR_COUNTER_INDEX, DEPARTURE_TOUR_INDEX, TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';

type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;

export default class DepartureTourRepositoryImpl implements DepartureTourRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate lead code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generateDepartureTourCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${DEPARTURE_TOUR_COUNTER_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  /**
   * Retrieves a list of departure tours for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns A list of departure tours.
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi1_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`,
        ':lsi1_filter_value': `${CREATED_AT_INDEX}#`,
      },
    };

    logger.log(`Listing departure tours for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const departureTours: DepartureTour[] = await dynamoProvider.query(params);

    // Logging the results
    logger.log(`Found ${departureTours.length} departure tours for tenant ${tenantId}`);
    logger.log('Departure tours items:', departureTours);

    return departureTours;
  };

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

  /**
   * Creates a new DepartureTour for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @param departureTour The DepartureTour object to be created.
   * @returns The created DepartureTour.
   */
  create = async (tenantId: string, departureTour: DepartureTour) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`;
    const sk = `${departureTour.code}`;

    logger.log(`Creating DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - DepartureTour:`, departureTour);

    await dynamoProvider.putItem(table, pk, sk, departureTour);

    logger.log(`DepartureTour created successfully for tenant ${tenantId}`);

    return departureTour;
  };

  /**
   * Updates a DepartureTour for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param departureTourId The ID of the departure tour.
   * @param departureTour The updated DepartureTour object.
   * @returns The updated DepartureTour.
   */
  update = async (tenantId: string, departureTourId: string, departureTour: DepartureTour) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`;
    const sk = `${departureTourId}`;

    logger.log(`Updating DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - DepartureTour:`, departureTour);

    await dynamoProvider.putItem(table, pk, sk, departureTour);

    logger.log(`DepartureTour updated successfully for tenant ${tenantId}`);

    return departureTour;
  };

  /**
   * Deletes a DepartureTour for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param departureTourId The ID of the departure tour.
   * @returns The ID of the deleted departure tour.
   */
  delete = async (tenantId: string, departureTourId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`;
    const sk = `${departureTourId}`;

    logger.log(`Deleting DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`DepartureTour deleted successfully for tenant ${tenantId}`);

    return departureTourId;
  };
}
