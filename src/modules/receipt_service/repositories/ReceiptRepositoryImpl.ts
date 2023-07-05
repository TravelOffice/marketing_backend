import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import logger from '../utils/logger';
import { Receipt } from '../models/Receipt';
import { CREATED_AT_INDEX, RECEIPT_INDEX, TENANT_INDEX } from '../utils/constants';
import { ReceiptRepository } from './interfaces/ReceiptRepository';

type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;

export default class ReceiptRepositoryImpl implements ReceiptRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate receipt code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generateReceiptCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${RECEIPT_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  /**
   * Retrieves a list of receipts for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns The list of receipts
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi1_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${RECEIPT_INDEX}`,
        ':lsi1_filter_value': `${CREATED_AT_INDEX}#`,
      },
    };

    logger.log(`Listing receipts for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const receipts: Receipt[] = await dynamoProvider.query(params);

    // Logging the results
    logger.log(`Found ${receipts.length} receipts for tenant ${tenantId}`);

    return receipts;
  };

  /**
   * Retrieves a specific receipt for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the receipt.
   * @returns The receipt.
   * @throws Error if the receipt is not found.
   */
  get = async (tenantId: string, id: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    logger.log(`Retrieving Receipt for tenant ${tenantId} with [${id}]`);

    const receipt = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${RECEIPT_INDEX}`,
      `${id}`,
    );
    if (!receipt) throw new Error(`Receipt [${id}] not found`);

    logger.log('Receipt retrieved:', receipt);

    return receipt as Receipt;
  };

  /**
   * Creates a new receipt for a tenant.
   * @param tenantId The ID of the tenant.
   * @param receipt The receipt object.
   * @returns The created receipt.
   */
  create = async (tenantId: string, receipt: Receipt) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${RECEIPT_INDEX}`;
    const sk = `${receipt.code}`;

    logger.log(`Creating Receipt for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - Receipt:`, receipt);

    await dynamoProvider.putItem(table, pk, sk, receipt);

    logger.log(`Receipt was created successfully for tenant ${tenantId}`);

    return receipt;
  };

  /**
   * Updates an existing receipt for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the receipt.
   * @param receipt The updated receipt object.
   * @returns The updated receipt.
   * @throws Error if the receipt is not found.
   */
  update = async (tenantId: string, id: string, receipt: Receipt) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${RECEIPT_INDEX}`;
    const sk = `${id}`;

    logger.log(`Updating Receipt for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - Receipt:`, receipt);

    await dynamoProvider.putItem(table, pk, sk, receipt);

    logger.log(`Receipt was updated successfully for tenant ${tenantId}`);

    return receipt;
  };

  /**
   * Deletes a receipt for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the receipt to delete.
   * @returns The ID of the deleted receipt.
   */
  delete = async (tenantId: string, id: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${RECEIPT_INDEX}`;
    const sk = `${id}`;

    logger.log(`Deleting Receipt for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`Receipt deleted successfully for tenant ${tenantId}`);

    return id;
  };
}
