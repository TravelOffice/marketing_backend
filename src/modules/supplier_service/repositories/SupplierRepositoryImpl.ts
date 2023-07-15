import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, QueryInput } from 'core';
import { Quote, Supplier } from '../models/Supplier';
import { SUPPLIER_COUNTER_INDEX, SUPPLIER_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { SupplierRepository } from './interfaces/SupplierRepository';

export default class SupplierRepositoryImpl
implements SupplierRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate supplier code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generateCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${SUPPLIER_COUNTER_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  /**
   * Retrieves a list of suppliers for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns A list of suppliers.
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`,
      },
    };

    logger.log(`Listing suppliers for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const items: Supplier[] = await dynamoProvider.query(params);
    const suppliers = items.map(
      (item) => helper.excludeDataFromObject(item) as Supplier,
    );

    logger.log(
      `Found ${suppliers.length} suppliers for tenant ${tenantId}`,
    );
    logger.log('Formatted items:', suppliers);

    return suppliers;
  };

  /**
   * Retrieves a supplier for a specific tenant and supplier ID.
   * @param tenantId The ID of the tenant.
   * @param supplierId The ID of the supplier.
   * @returns The retrieved supplier with its assigned ID.
   */
  get = async (tenantId: string, supplierId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`;
    const sk = supplierId;

    logger.log(
      `Retrieving Supplier for tenant ${tenantId} with supplier ID [${supplierId}], pk [${pk}], sk [${sk}]`,
    );

    const supplier = await dynamoProvider.getItem<Supplier>(table, pk, sk);
    if (!supplier) throw new Error(`Supplier [${supplierId}] not found`);

    logger.log('Supplier retrieved:', supplier);

    return helper.excludeDataFromObject(supplier) as Supplier;
  };

  /**
   * Creates a new Supplier for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @param supplier The Supplier object to be created.
   * @returns The created Supplier with its assigned ID.
   */
  create = async (tenantId: string, supplier: Supplier) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`;
    const sk = `${supplier.code}`;

    logger.log(
      `Creating Supplier for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );
    logger.log(`Tenant ${tenantId} - Supplier:`, supplier);

    await dynamoProvider.putItem(table, pk, sk, supplier);

    logger.log(`Supplier created successfully for tenant ${tenantId}`);

    return helper.excludeDataFromObject(supplier) as Supplier;
  };

  /**
   * Updates a Supplier for a specific tenant and supplier ID.
   * @param tenantId The ID of the tenant.
   * @param supplierId The ID of the supplier.
   * @param supplier The updated Supplier object.
   * @returns The updated Supplier.
   */
  update = async (
    tenantId: string,
    supplierId: string,
    supplier: Supplier,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`;
    const sk = supplierId;

    logger.log(
      `Updating Supplier for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );
    logger.log(`Tenant ${tenantId} - Supplier:`, supplier);

    const existingSupplier = await dynamoProvider.getItem<Supplier>(
      table,
      pk,
      sk,
    );
    if (!existingSupplier) {
      throw new Error(
        `supplier [${supplierId}] not found for tenant ${tenantId}`,
      );
    }

    const updatedAt = Date.now();
    const { code, createdAt, ...supplierToUpdate } = supplier;

    const result = await dynamoProvider.updateItemWithSetExpression(
      table,
      pk,
      sk,
      {
        ...supplierToUpdate, updatedAt,
      },
    );

    logger.log(`Supplier updated successfully for tenant ${tenantId}`);

    return helper.excludeDataFromObject(result) as Supplier;
  };

  /**
   * Deletes a Supplier for a specific tenant and supplier ID.
   * @param tenantId The ID of the tenant.
   * @param supplierId The ID of the supplier.
   * @returns The ID of the deleted supplier.
   */
  delete = async (tenantId: string, supplierId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`;
    const sk = supplierId;

    logger.log(
      `Deleting Supplier for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`Supplier deleted successfully for tenant ${tenantId}`);

    return supplierId;
  };

  /**
   * Updates a Supplier for a specific tenant and supplier ID.
   * @param tenantId The ID of the tenant.
   * @param supplierId The ID of the supplier.
   * @param quotes The updated quote array for supplier.
   * @returns The supplier with updated quotes.
   */
  updateQuotes = async (
    tenantId: string,
    supplierId: string,
    quotes: Array<Quote>,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`;
    const sk = supplierId;

    logger.log(
      `Updating quotes for supplier ${supplierId} - tenant ${tenantId} with pk: ${pk}, sk: ${sk}`,
    );
    logger.log(`Tenant ${tenantId} - Supplier ${supplierId} - Quotes:`, quotes);

    const existingSupplier = await dynamoProvider.getItem<Supplier>(
      table,
      pk,
      sk,
    );
    if (!existingSupplier) {
      throw new Error(
        `Supplier [${supplierId}] not found for tenant ${tenantId}`,
      );
    }

    const updatedAt = Date.now();
    const {
      code, createdAt, creatorId, creatorName, ...supplierToUpdate
    } = helper.excludeDataFromObject(existingSupplier);

    const result = await dynamoProvider.updateItemWithSetExpression(
      table,
      pk,
      sk,
      {
        ...supplierToUpdate, quotes, updatedAt,
      },
    );

    logger.log(`Update quotes for supplier ${supplierId} - tenant ${tenantId} successfully`);

    return helper.excludeDataFromObject(result) as Supplier;
  };
}
