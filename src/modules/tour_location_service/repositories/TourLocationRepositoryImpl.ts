import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import logger from 'core/utils/logger';
import { TourLocation } from '../models/TourLocation';
import { TourLocationRepository } from './interfaces/TourLocationRepository';
import { CREATED_AT_INDEX, TENANT_INDEX, TOUR_LOCATION_INDEX } from '../utils/constants';

type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;

export default class TourLocationRepositoryImpl implements TourLocationRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate tour location code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generateTourLocationCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${TOUR_LOCATION_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  /**
   * Retrieves a list of tour locations for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns The list of tour locations.
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi1_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${TOUR_LOCATION_INDEX}`,
        ':lsi1_filter_value': `${CREATED_AT_INDEX}#`,
      },
    };

    logger.log(`Listing tours location for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const toursLocation: TourLocation[] = await dynamoProvider.query(params);

    // Logging the results
    logger.log(`Found ${toursLocation.length} tours location for tenant ${tenantId}`);
    logger.log('Tours location items:', toursLocation);

    return toursLocation;
  };

  /**
   * Retrieves a specific tour location for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the tour location.
   * @returns The tour location.
   * @throws Error if the tour location is not found.
   */
  get = async (tenantId: string, id: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    logger.log(`Retrieving Tour Location for tenant ${tenantId} with [${id}]`);

    const tourLocation = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${TOUR_LOCATION_INDEX}`,
      `${id}`,
    );
    if (!tourLocation) throw new Error(`Tour Location [${id}] not found`);

    logger.log('Tour Location retrieved:', tourLocation);

    return tourLocation as TourLocation;
  };

  /**
   * Creates a new tour location for a tenant.
   * @param tenantId The ID of the tenant.
   * @param tourLocation The tour location object.
   * @returns The created tour location.
   */
  create = async (tenantId: string, tourLocation: TourLocation) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_LOCATION_INDEX}`;
    const sk = `${tourLocation.code}`;

    logger.log(`Creating Tour Location for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - Tour Location:`, tourLocation);

    await dynamoProvider.putItem(table, pk, sk, tourLocation);

    logger.log(`Tour Location created successfully for tenant ${tenantId}`);

    return tourLocation;
  };

  /**
   * Updates an existing tour location for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the tour location.
   * @param tourLocation The updated tour location object.
   * @returns The updated tour location.
   * @throws Error if the tour location is not found.
   */
  update = async (tenantId: string, id: string, tourLocation: TourLocation) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_LOCATION_INDEX}`;
    const sk = `${id}`;

    logger.log(`Updating Tour Location for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - Tour Location:`, tourLocation);

    await dynamoProvider.putItem(table, pk, sk, tourLocation);

    logger.log(`TourLocation updated successfully for tenant ${tenantId}`);

    return tourLocation;
  };

  /**
   * Deletes a tour location for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the tour location to delete.
   * @returns The ID of the deleted tour location.
   */
  delete = async (tenantId: string, id: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_LOCATION_INDEX}`;
    const sk = `${id}`;

    logger.log(`Deleting Tour Location for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`Tour Location deleted successfully for tenant ${tenantId}`);

    return id;
  };
}
