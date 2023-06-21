import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { TourTemplate } from '../models/TourTemplate';
import { dynamoProvider } from '../providers';
import {
  TENANT_INDEX,
  TOUR_TEMPLATE_INDEX,
  TOUR_TEMPLATE_ONSALE,
  TOUR_TEMPLATE_STATUS_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { generateReadableId } from '../utils/utils';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class TourTemplateRepositoryImpl
  implements TourTemplateRepository
{
  /**
   * Retrieves a list of departure tours for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns A list of departure tours.
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter_value': { S: `${TOUR_TEMPLATE_INDEX}#` },
      },
    };

    logger.log(`Listing departure tours for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const items = await dynamoProvider.query(params);

    // Formatting the items and adding the id property
    const tourTemplate = items.map((item) => {
      const { pk, sk, ...rest } = item;
      return {
        id: sk.split('#')[1],
        ...rest,
      };
    });

    // Logging the results
    logger.log(
      `Found ${tourTemplate.length} departure tours for tenant ${tenantId}`
    );
    logger.log('Formatted items:', tourTemplate);

    return tourTemplate;
  };

  /**
   * Retrieves a departure tour for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the departure tour.
   * @returns The retrieved departure tour with its assigned ID.
   */
  get = async (tenantId: string, tourTemplateId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${TOUR_TEMPLATE_INDEX}#${tourTemplateId}`;

    logger.log(
      `Retrieving TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`
    );

    const tourTemplate = await dynamoProvider.getItem<TourTemplate>(
      table,
      pk,
      sk
    );
    if (!tourTemplate)
      throw new Error(`Departure tour [${tourTemplateId}] not found`);

    logger.log('TourTemplate retrieved:', tourTemplate);

    return {
      id: tourTemplateId,
      ...tourTemplate,
    };
  };

  /**
   * Creates a new TourTemplate for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @param tourTemplate The TourTemplate object to be created.
   * @returns The created TourTemplate with its assigned ID.
   */
  create = async (tenantId: string, tourTemplate: TourTemplate) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const tourTemplateId = generateReadableId();
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${TOUR_TEMPLATE_INDEX}#${tourTemplateId}`;
    const currentTime = Date.now();

    logger.log(
      `Creating TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`
    );
    logger.log(`Tenant ${tenantId} - TourTemplate:`, tourTemplate);

    await dynamoProvider.putItem(table, pk, sk, {
      ...tourTemplate,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    logger.log(`TourTemplate created successfully for tenant ${tenantId}`);

    return {
      id: tourTemplateId,
      ...tourTemplate,
    };
  };

  /**
   * Updates a TourTemplate for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the departure tour.
   * @param tourTemplate The updated TourTemplate object.
   * @returns The updated TourTemplate.
   */
  update = async (
    tenantId: string,
    tourTemplateId: string,
    tourTemplate: TourTemplate
  ) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${TOUR_TEMPLATE_INDEX}#${tourTemplateId}`;

    logger.log(
      `Updating TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`
    );
    logger.log(`Tenant ${tenantId} - TourTemplate:`, tourTemplate);

    const existingTourTemplate = dynamoProvider.getItem<TourTemplate>(
      table,
      pk,
      sk
    );
    if (!existingTourTemplate) {
      throw new Error(
        `Departure tour [${tourTemplateId}] not found for tenant ${tenantId}`
      );
    }

    await dynamoProvider.putItem(table, pk, sk, tourTemplate);

    logger.log(`TourTemplate updated successfully for tenant ${tenantId}`);

    return {
      id: tourTemplateId,
      ...tourTemplate,
    };
  };

  /**
   * Deletes a TourTemplate for a specific tenant and departure tour ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the departure tour.
   * @returns The ID of the deleted departure tour.
   */
  delete = async (tenantId: string, tourTemplateId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${TOUR_TEMPLATE_INDEX}#${tourTemplateId}`;

    logger.log(
      `Deleting TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`
    );

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`TourTemplate deleted successfully for tenant ${tenantId}`);

    return tourTemplateId;
  };
}
