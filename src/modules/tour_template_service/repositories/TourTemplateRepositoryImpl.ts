import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, QueryInput } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { TourTemplate } from '../models/TourTemplate';
import { TENANT_INDEX, TOUR_TEMPLATE_COUNTER_INDEX, TOUR_TEMPLATE_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';

export default class TourTemplateRepositoryImpl
implements TourTemplateRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate lead code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generateTourTemplateCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${TOUR_TEMPLATE_COUNTER_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  /**
   * Retrieves a list of tour templates for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns A list of tour templates.
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`,
      },
    };

    logger.log(`Listing tour templates for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const items: TourTemplate[] = await dynamoProvider.query(params);
    const tourTemplates = items.map(
      (item) => helper.excludeDataFromObject(item) as TourTemplate,
    );

    // Logging the results
    logger.log(
      `Found ${tourTemplates.length} tour templates for tenant ${tenantId}`,
    );
    logger.log('Formatted items:', tourTemplates);

    return tourTemplates;
  };

  availableListForMarketplace = async (tenant: string, paginationParams: PaginationParams) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const queryParams = {
      TableName: travelTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenant}#${TOUR_TEMPLATE_INDEX}`,
      },
    };
    return dynamoProvider.queryPagination<TourTemplate>(
      queryParams,
      paginationParams,
    );
  };

  /**
   * Retrieves a tour template for a specific tenant and tour template ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the tour template.
   * @returns The retrieved tour template with its assigned ID.
   */
  get = async (tenantId: string, tourTemplateId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`;
    const sk = tourTemplateId;

    logger.log(
      `Retrieving TourTemplate for tenant ${tenantId} with tour template ID [${tourTemplateId}], pk [${pk}], sk [${sk}]`,
    );

    const tourTemplate = await dynamoProvider.getItem<TourTemplate>(table, pk, sk);
    if (!tourTemplate) throw new Error(`Tour Template [${tourTemplateId}] not found`);

    logger.log('TourTemplate retrieved:', tourTemplate);

    return tourTemplate as TourTemplate;
  };

  /**
   * Creates a new TourTemplate for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @param tourTemplate The TourTemplate object to be created.
   * @returns The created TourTemplate with its assigned ID.
   */
  create = async (tenantId: string, tourTemplate: TourTemplate) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`;
    const sk = `${tourTemplate.code}`;

    logger.log(
      `Creating TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );
    logger.log(`Tenant ${tenantId} - TourTemplate:`, tourTemplate);

    await dynamoProvider.putItem(table, pk, sk, tourTemplate);

    logger.log(`TourTemplate created successfully for tenant ${tenantId}`);

    return helper.excludeDataFromObject(tourTemplate) as TourTemplate;
  };

  /**
   * Updates a TourTemplate for a specific tenant and tour template ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the tour template.
   * @param tourTemplate The updated TourTemplate object.
   * @returns The updated TourTemplate.
   */
  update = async (
    tenantId: string,
    tourTemplateId: string,
    tourTemplate: TourTemplate,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`;
    const sk = tourTemplateId;

    logger.log(
      `Updating TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );
    logger.log(`Tenant ${tenantId} - TourTemplate:`, tourTemplate);

    const existingTourTemplate = dynamoProvider.getItem<TourTemplate>(
      table,
      pk,
      sk,
    );
    if (!existingTourTemplate) {
      throw new Error(
        `Tour Template [${tourTemplateId}] not found for tenant ${tenantId}`,
      );
    }

    const updatedAt = Date.now();
    const { code, createdAt, ...tourTemplateToUpdate } = tourTemplate;

    const result = await dynamoProvider.updateItemWithSetExpression(
      table,
      pk,
      sk,
      {
        ...tourTemplateToUpdate, updatedAt,
      },
    );

    logger.log(`TourTemplate updated successfully for tenant ${tenantId}`);

    return helper.excludeDataFromObject(result.Attributes as TourTemplate) as TourTemplate;
  };

  /**
   * Deletes a TourTemplate for a specific tenant and tour template ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the tour template.
   * @returns The ID of the deleted tour template.
   */
  delete = async (tenantId: string, tourTemplateId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`;
    const sk = tourTemplateId;

    logger.log(
      `Deleting TourTemplate for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`TourTemplate deleted successfully for tenant ${tenantId}`);

    return tourTemplateId;
  };
}
