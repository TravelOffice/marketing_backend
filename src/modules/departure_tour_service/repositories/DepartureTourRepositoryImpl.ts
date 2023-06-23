import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { DepartureTour } from '../models/DepartureTour';
import { dynamoProvider } from '../providers';
import { DEPARTURE_TOUR_COUNTER_INDEX, DEPARTURE_TOUR_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { DepartureTourRepository } from './interfaces/DepartureTourRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class DepartureTourRepositoryImpl implements DepartureTourRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate lead code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The updated counter value.
   */
  generateDepartureTourCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const result = await dynamoProvider.updateItem(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${DEPARTURE_TOUR_COUNTER_INDEX}`,
        'SET incrIndex = if_not_exists(incrIndex, :start) + :increment',
        {
          ':start': 0, // Initial value if the attribute doesn't exist
          ':increment': 1, // Increment value
        },
      );
      const attributes = AWS.DynamoDB.Converter.unmarshall(result.Attributes!);
      const count = attributes.incrIndex;
      logger.log(`Increment operation successful for tenant ${tenantId}. Counter: ${count}`);
      return count as number;
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
        ':pk': { S: `${TENANT_INDEX}#${tenantId}` },
        ':lsi1_filter_value': { S: `${DEPARTURE_TOUR_INDEX}#` },
      },
    };

    logger.log(`Listing departure tours for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const items = await dynamoProvider.query(params);

    // Formatting the items and adding the id property
    const departureTours = items.map((item) => {
      const {
        pk, sk, lsi1, ...rest
      } = item;
      return rest;
    });

    // Logging the results
    logger.log(`Found ${departureTours.length} departure tours for tenant ${tenantId}`);
    logger.log('Formatted items:', departureTours);

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
      `${TENANT_INDEX}#${tenantId}`,
      `${DEPARTURE_TOUR_INDEX}#${departureTourId}`,
    );
    if (!item) throw new Error(`Departure tour [${departureTourId}] not found`);

    logger.log('DepartureTour retrieved:', item);

    const {
      pk, sk, lsi1, ...departureTour
    } = item;

    return departureTour;
  };

  /**
   * Creates a new DepartureTour for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @param departureTour The DepartureTour object to be created.
   * @returns The created DepartureTour.
   */
  create = async (tenantId: string, departureTour: DepartureTour) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${DEPARTURE_TOUR_INDEX}#${departureTour.code}`;

    logger.log(`Creating DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - DepartureTour:`, departureTour);

    await dynamoProvider.putItem(table, pk, sk, departureTour);

    logger.log(`DepartureTour created successfully for tenant ${tenantId}`);

    const {
      lsi1, ...rest
    } = departureTour;

    return rest as DepartureTour;
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
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${DEPARTURE_TOUR_INDEX}#${departureTourId}`;

    logger.log(`Updating DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - DepartureTour:`, departureTour);

    const existingDepartureTour = await dynamoProvider.getItem<DepartureTour>(table, pk, sk);
    if (!existingDepartureTour) {
      throw new Error(`Departure tour [${departureTourId}] not found for tenant ${tenantId}`);
    }

    await dynamoProvider.putItem(
      table,
      pk,
      sk,
      {
        ...departureTour,
        code: departureTourId,
        lsi1: existingDepartureTour.lsi1,
        createdAt: existingDepartureTour.createdAt,
      },
    );

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
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${DEPARTURE_TOUR_INDEX}#${departureTourId}`;

    logger.log(`Deleting DepartureTour for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`DepartureTour deleted successfully for tenant ${tenantId}`);

    return departureTourId;
  };
}
